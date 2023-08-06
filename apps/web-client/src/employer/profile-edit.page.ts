import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CSCApi, City, Country, State, Timezone } from '@easworks/app-shell/api/csc';
import { GMapsApi } from '@easworks/app-shell/api/gmap';
import { DropDownIndicatorComponent } from '@easworks/app-shell/common/drop-down-indicator.component';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { isTimezone } from '@easworks/app-shell/common/location';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { filterCountryCode, getPhoneCodeOptions, updatePhoneValidatorEffect } from '@easworks/app-shell/common/phone-code';
import { GeoLocationService } from '@easworks/app-shell/services/geolocation';
import { AuthState } from '@easworks/app-shell/state/auth';
import { DomainState, IndustryGroup } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { dynamicallyRequired } from '@easworks/app-shell/utilities/dynamically-required';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { EMPLOYER_ORG_SIZE_OPTIONS, EMPLOYER_TYPE_OPTIONS, EmployerOrgSize, EmployerType, LatLng } from '@easworks/models';

@Component({
  selector: 'employer-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImportsModule,
    MatPseudoCheckboxModule,
    MatAutocompleteModule,
    DropDownIndicatorComponent
  ]
})
export class EmployerProfileEditPageComponent {

  constructor() {
    const status$ = toSignal(controlStatus$(this.form), { requireSync: true });
    const isInvalid$ = computed(() => status$() !== 'VALID');
    this.disableSubmit$ = computed(() => this.loading.any$() || isInvalid$());
  }

  private readonly injector = inject(INJECTOR);
  private readonly route = inject(ActivatedRoute);
  private readonly domainState = inject(DomainState);
  private readonly user = inject(AuthState).user$;
  private readonly api = {
    csc: inject(CSCApi),
    gmap: inject(GMapsApi),
  } as const;

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';
  private readonly loading = generateLoadingState<[
    'industries',
    'domains',
    'geolocation',
    'country',
    'state',
    'city',
    'timezone'
  ]>();

  protected readonly trackBy = {
    country: (_: number, c: Country) => c.iso2,
    state: (_: number, s: State) => s.iso2,
    name: (_: number, i: { name: string; }) => i.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
    key: (_: number, kv: KeyValue<string, unknown>) => kv.key
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly allCountries = this.api.csc.allCountries();

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(300)
      ]
    }),
    summary: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(1500)
      ]
    }),
    type: new FormControl(null as unknown as SelectableOption<EmployerType>, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    employeeSize: new FormControl(null as unknown as SelectableOption<EmployerOrgSize>, {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    industry: new FormGroup({
      group: new FormControl(null as unknown as IndustryGroup, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    }),
    software: new FormRecord<FormControl<SelectableOption<string>[]>>({}),
    contact: new FormGroup({
      email: new FormControl(
        this.isNew && this.user()?.email || '', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(300)]
      }),
      phoneNumber: new FormGroup({
        code: new FormControl(''),
        number: new FormControl(''),
      }),
      website: new FormControl('', {
        validators: [Validators.maxLength(300)]
      })
    }),
    location: new FormGroup({
      country: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      state: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      timezone: new FormControl('', {
        validators: [
          Validators.required,
          isTimezone
        ],
        nonNullable: true
      })
    })
  });

  protected readonly disableSubmit$;

  protected readonly type = {
    toggle: (option: SelectableOption<EmployerType>) => {
      if (option.selected)
        return;

      const control = this.form.controls.type;
      option.selected = true;
      const old = control.value;
      if (old) {
        old.selected = false;
      }
      control.setValue(option);
    },
    options: EMPLOYER_TYPE_OPTIONS.map<SelectableOption<EmployerType>>(t => ({
      selected: false,
      value: t,
      label: t
    }))
  } as const;

  protected readonly employeeSize = {
    toggle: (option: SelectableOption<EmployerOrgSize>) => {
      if (option.selected)
        return;

      const control = this.form.controls.employeeSize;
      option.selected = true;
      const old = control.value;
      if (old) {
        old.selected = false;
      }
      control.setValue(option);
    },
    options: EMPLOYER_ORG_SIZE_OPTIONS.map<SelectableOption<EmployerOrgSize>>(s => ({
      selected: false,
      value: s,
      label: s
    }))
  } as const;

  protected readonly industry = this.initIndustry();
  protected readonly software = this.initSoftware();
  protected readonly contact = this.initContact();

  private initIndustry() {
    {
      const loading = computed(() => this.domainState.industries$().length === 0);
      effect(() => {
        if (loading())
          this.loading.add('industries');
        else
          this.loading.delete('industries');
      }, { allowSignalWrites: true });
      this.domainState.loadIndustries();
    }

    const loading$ = this.loading.has('industries');

    const query$ = signal<string>('');

    const filteredOptions$ = computed(() => {
      const q = query$();
      const all = this.domainState.industries$();

      const filter = q && q.trim().toLowerCase();

      if (filter) {
        const filtered = all
          .map<IndustryGroup>(g => {
            const matchGroup = g.name.toLowerCase().includes(filter);
            if (matchGroup) {
              return g;
            }
            return {
              name: g.name,
              industries: g.industries.filter(i => i.toLowerCase().includes(filter)),
            };
          })
          .filter(ig => ig.industries.length);
        return filtered;
      }

      return all;
    });

    const select = (group: IndustryGroup, name: string) => {
      this.form.controls.industry.setValue({ group, name });
    };

    const clear = () => {
      this.form.controls.industry.setValue({
        group: null as unknown as IndustryGroup,
        name: ''
      });
    };

    return {
      query$,
      options$: filteredOptions$,
      select,
      clear,
      loading$
    };
  }

  private initSoftware() {
    {
      const loading = computed(() => this.domainState.domains.list$().length === 0);
      effect(() => {
        if (loading())
          this.loading.add('domains');
        else
          this.loading.delete('domains');
      }, { allowSignalWrites: true });
    }
    const loading$ = this.loading.has('domains');

    const count$ = signal(0);
    const hasItems$ = computed(() => count$() > 0);

    const form = this.form.controls.software;
    const value$ = toSignal(controlValue$(form), { requireSync: true });

    const query$ = signal<string>('');

    type OptionGroup = {
      name: string;
      software: SelectableOption<string>[];
    };

    const all$ = computed(() => this.domainState.domains.list$()
      .map<OptionGroup>(d => ({
        name: d.longName,
        software: d.allProducts.map(p => ({
          selected: false,
          value: p.name,
          label: p.name
        }))
      })));

    const filteredOptions$ = computed(() => {
      const q = query$();
      const all = all$();

      const filter = q && q.trim().toLowerCase();

      const filtered = all
        .map(g => {
          const matchGroup = filter && g.name.toLowerCase().includes(filter);
          if (matchGroup) {
            return {
              name: g.name,
              software: g.software.filter(i => !i.selected),
            };
          }
          return {
            name: g.name,
            software: g.software.filter(i => !i.selected && (!filter || i.value.toLowerCase().includes(filter)))
          };
        })
        .filter(g => g.software.length);

      return filtered;
    });

    const handlers = {
      add: (domain: string, option: SelectableOption<string>) => {
        if (option.selected)
          return;
        option.selected = true;
        let control = form.controls[domain];
        if (!control) {
          control = new FormControl([], { nonNullable: true });
          form.addControl(domain, control);
        }
        control.value.push(option);
        control.value.sort((a, b) => sortString(a.value, b.value));
        control.updateValueAndValidity();
        query$.mutate(v => v);
        count$.update(v => ++v);
      },
      remove: (domain: string, i: number) => {
        const control = form.controls[domain];
        if (!control)
          throw new Error('invalid operation');
        const option = control.value.at(i);
        if (!option)
          throw new Error('invalid operation');

        option.selected = false;
        control.value.splice(i, 1);
        if (control.value.length)
          control.updateValueAndValidity();
        else
          form.removeControl(domain);
        query$.mutate(v => v);
        count$.update(v => --v);
      }
    };

    return {
      count$,
      hasItems$,
      loading$,
      value$,
      query$,
      options$: filteredOptions$,
      ...handlers
    };
  }

  private initContact() {
    const { contact, location } = this.form.controls;
    const values = {
      phone: {
        code: toSignal(controlValue$(contact.controls.phoneNumber.controls.code), { requireSync: true }),
      },
      country: toSignal(controlValue$(location.controls.country), { requireSync: true }),
      state: toSignal(controlValue$(location.controls.state), { requireSync: true }),
      city: toSignal(controlValue$(location.controls.city), { requireSync: true }),
      timezone: toSignal(controlValue$(location.controls.timezone), { requireSync: true })
    } as const;

    const status = {
      country: toSignal(controlStatus$(location.controls.country), { requireSync: true }),
      state: toSignal(controlStatus$(location.controls.state), { requireSync: true }),
    };

    const allOptions = {
      country$: signal<Country[]>([]),
      state$: signal<State[]>([]),
      city$: signal<City[]>([]),
      timezone$: signal<Timezone[]>([]),
      countryCode: signal<(Country & { plainPhoneCode: string; })[]>([]),
    } as const;

    const filteredOptions = {
      phoneCode$: filterCountryCode(allOptions.countryCode, values.phone.code),
      country$: computed(() => {
        const value = values.country();
        const all = allOptions.country$();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(c => c.name.toLowerCase().includes(filter));
        return all;
      }),
      state$: computed(() => {
        const value = values.state();
        const all = allOptions.state$();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(s => s.name.toLowerCase().includes(filter));
        return all;
      }),
      city$: computed(() => {
        const value = values.city();
        const all = allOptions.city$();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(c => c.name.toLowerCase().includes(filter));
        return all;
      }),
      timezone$: computed(() => {
        const value = values.timezone();
        const all = allOptions.timezone$();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(c => c.zoneName.toLowerCase().includes(filter));
        return all;
      })
    } as const;

    const validation = {
      stateRequired$: computed(() => allOptions.state$().length > 0),
      cityRequired$: computed(() => allOptions.city$().length > 0)
    };

    const loading = {
      geo$: this.loading.has('geolocation'),
      country$: this.loading.has('country'),
      state$: this.loading.has('state'),
      city$: this.loading.has('city'),
      timezone$: this.loading.has('timezone'),
    } as const;

    const disabled = {
      country$: computed(() => loading.geo$() || loading.country$()),
      state$: computed(() => loading.geo$() || loading.state$() || status.country() !== 'VALID'),
      city$: computed(() => loading.geo$() || loading.city$() || status.country() !== 'VALID'),
      timezone$: computed(() => loading.geo$() || loading.timezone$() || status.country() !== 'VALID' || allOptions.timezone$().length === 0),
    } as const;

    effect(() => disabled.country$() ? location.controls.country.disable() : location.controls.country.enable(), { allowSignalWrites: true });
    effect(() => disabled.state$() ? location.controls.state.disable() : location.controls.state.enable(), { allowSignalWrites: true });
    effect(() => disabled.city$() ? location.controls.city.disable() : location.controls.city.enable(), { allowSignalWrites: true });
    effect(() => disabled.timezone$() ? location.controls.timezone.disable() : location.controls.timezone.enable(), { allowSignalWrites: true });

    // dynamically add/remove validators for the state and city controls
    {
      dynamicallyRequired(validation.stateRequired$, location.controls.state);
      dynamicallyRequired(validation.cityRequired$, location.controls.city);
    }

    updatePhoneValidatorEffect(contact.controls.phoneNumber);

    // react to changes in the country control
    effect(async () => {
      const options = filteredOptions.country$();
      const country = values.country();
      location.controls.state.reset();
      location.controls.city.reset();
      location.controls.timezone.reset();

      allOptions.state$.set([]);
      allOptions.city$.set([]);
      allOptions.timezone$.set([]);

      if (options.length < 25) {
        const match = options.find(o => o.name.toLowerCase() === country.trim().toLowerCase());
        if (match) {
          // populate the options for timezone
          {
            this.loading.add('timezone');
            const cscTz = match.timezones;
            if (cscTz.length)
              allOptions.timezone$.set(cscTz);
            else {
              const all = await this.api.csc.allTimezones();
              allOptions.timezone$.set(all);
            }
            this.loading.delete('timezone');
          }

          // populate the options for state
          this.loading.add('state');
          if (match.name.length === country.length) {
            if (match.name !== country) {
              location.controls.country.setValue(match.name);
            }
            else {
              const states = await this.api.csc.allStates(match.iso2);
              if (states.length) {
                states.sort((a, b) => sortString(a.name, b.name));
                allOptions.state$.set(states);
              }
              // populate the options for cities when no states were found
              else {
                this.loading.add('city');
                const cities = await this.api.csc.allCities(match.iso2);
                cities.sort((a, b) => sortString(a.name, b.name));
                allOptions.city$.set(cities);
                this.loading.delete('city');
              }
            }
          }
          this.loading.delete('state');
        }
      }
    }, { allowSignalWrites: true });

    effect(async () => {
      const options = filteredOptions.state$();
      const state = values.state();
      location.controls.city.reset();
      allOptions.city$.set([]);

      if (options.length < 25) {
        const match = options.find(o => o.name.toLowerCase() === state.trim().toLowerCase());
        if (match && match.name.length === state.length) {
          if (match.name !== state) {
            location.controls.state.setValue(match.name);
          }
          else {
            // populate the options for cities
            this.loading.add('city');
            const cities = await this.api.csc.allCities(match.country_code, match.iso2);
            if (cities.length) {
              cities.sort((a, b) => sortString(a.name, b.name));
              allOptions.city$.set(cities);
            }
            else {
              const cities = await this.api.csc.allCities(match.country_code);
              cities.sort((a, b) => sortString(a.name, b.name));
              allOptions.city$.set(cities);
            }
            this.loading.delete('city');
          }
        }
      }
    }, { allowSignalWrites: true });

    effect(async () => {
      const options = filteredOptions.city$();
      if (options.length < 25) {
        const city = values.city();
        const match = options.find(o => o.name.toLowerCase() === city.trim().toLowerCase());
        if (match && match.name.length === city.length && match.name !== city) {
          location.controls.city.setValue(match.name);
        }
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const options = allOptions.timezone$();
      if (options.length === 1) {
        location.controls.timezone.setValue(options[0].zoneName);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const options = filteredOptions.timezone$();
      if (options.length < 25) {
        const tz = values.timezone();
        const match = options.find(o => o.zoneName.toLowerCase() === tz.trim().toLowerCase());
        if (match && match.zoneName.length === tz.length && match.zoneName !== tz) {
          location.controls.timezone.setValue(match.zoneName);
        }
      }
    }, { allowSignalWrites: true });

    // populate the country list
    // pre-fill the current location
    {
      this.loading.add('country');
      this.allCountries
        .then(async countries => {
          allOptions.country$.set([...countries].sort((a, b) => sortString(a.name, b.name)));
          allOptions.countryCode.set(getPhoneCodeOptions(allOptions.country$()));
          this.loading.delete('country');

          if (this.isNew) {
            const cl = await this.getCurrentLocation();
            if (cl) {
              location.controls.country.setValue(cl.country?.long_name || '');

              await toPromise(loading.state$, v => v, this.injector);
              await toPromise(loading.state$, v => !v, this.injector);
              location.controls.state.setValue(cl.state?.long_name || '');

              await toPromise(loading.city$, v => v, this.injector);
              await toPromise(loading.city$, v => !v, this.injector);
              location.controls.city.setValue(cl.city?.long_name || '');
            }
          }
        });
    }

    return {
      options: filteredOptions,
      loading,
      validation
    };
  }

  private async getCurrentLocation() {
    try {
      this.loading.add('geolocation');

      const device = this.injector.get(GeoLocationService);

      const fromDevice = await device.get(true);

      const coords: LatLng = fromDevice ?
        { lat: fromDevice.coords.latitude, lng: fromDevice.coords.longitude } :
        await this.api.gmap.geolocateByIPAddress()
          .then(r => r.location);


      const response = await this.api.gmap.reverseGeocode(coords, ['postal_code']);

      if (response.status !== 'OK')
        return null;

      const components = response.results[0].address_components;

      const country = components.find(c => c.types.includes('country'));
      const state = components.find(c => c.types.includes('administrative_area_level_1'));
      const city = components.find(c => c.types.includes('locality'));

      return { country, state, city };
    }
    catch (e) {
      console.error(e);
      return null;
    }
    finally {
      this.loading.delete('geolocation');
    }
  }

  protected submit() {
    if (!this.form.valid)
      return;
  }
}
