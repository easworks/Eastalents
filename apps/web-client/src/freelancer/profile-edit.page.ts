import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { Domain, DomainState, FormImports, GeoLocationService, ImportsModule, LocationApi, LottiePlayerDirective, SelectableOption, generateLoadingState, sortString, statusSignal, valueSignal } from '@easworks/app-shell';
import { Country, Province } from '@easworks/models';
import { DateTime } from 'luxon';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'freelancer-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImports,
    MatAutocompleteModule
  ]
})
export class FreelancerProfileEditPageComponent implements OnInit {
  private readonly injector = inject(INJECTOR);
  private readonly route = inject(ActivatedRoute);
  private readonly geo = inject(GeoLocationService);
  private readonly api = {
    location: inject(LocationApi),
  } as const;
  private readonly domains = inject(DomainState)

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  private readonly loading = generateLoadingState<[
    'getting profile data' |
    'getting geolocation' |
    'getting countries' |
    'getting provinces' |
    'getting cities' |
    'getting timezone' |
    'getting primary domains'
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly section = this.initSection();

  protected readonly professionalSummary = this.initProfessionaSummary();
  protected readonly primaryDomains = this.initPrimaryDomains();

  protected readonly stepper = this.initStepper();

  private initStepper() {
    const step$ = signal<Step>(this.section ?? 'start');

    const showStepControls$ = computed(() => {
      if (this.section)
        return false;

      const step = step$();
      return step !== 'start' && step !== 'end';
    });


    const totalSteps = 3;
    const stepProgress$ = computed(() => {
      switch (step$()) {
        case 'professional-summary': return 1;
        case 'primary-domains': return 2;
        case 'services': return 3;
        default: return 0;
      }
    });


    const status = {
      summary: statusSignal(this.professionalSummary.form),
      primaryDomains: statusSignal(this.primaryDomains.form)
    } as const;

    const nextDisabled$ = computed(() => {
      const step = step$();
      return this.loading.any$() ||
        (step === 'professional-summary' && status.summary() !== 'VALID') ||
        (step === 'primary-domains' && status.primaryDomains() !== 'VALID');
    });

    return {
      totalSteps,
      step$,
      showStepControls$,
      progress$: computed(() => {
        const p = stepProgress$();
        return {
          label: `Step ${p} of ${totalSteps}`,
          percent: ((p - 1) / totalSteps) * 100
        }
      }),
      next: {
        visible$: computed(() => step$() !== 'social'),
        disabled$: nextDisabled$,
        click: () => {
          switch (step$()) {
            case 'start': return step$.set('professional-summary');
            case 'professional-summary': return step$.set('primary-domains');
            case 'primary-domains': return step$.set('services')
          }
        }
      },
      prev: {
        visible$: computed(() => step$() !== 'professional-summary'),
        click: () => {
          switch (step$()) {
            case 'primary-domains': return step$.set('professional-summary');
            case 'services': return step$.set('primary-domains');
          }
          // 
        }
      },
      submit: {
        disabled$: nextDisabled$,
        visible$: computed(() => step$() === 'social'),
        click: () => {
          // 
        }
      }
    } as const;
  }

  private initSection() {
    if (this.isNew)
      return null;

    const param = this.route.snapshot.queryParamMap.get('section');
    const allowed: Step[] = [];

    return allowed.find(i => i === param) ?? null;
  }

  private initProfessionaSummary() {
    const allOptions = {
      country$: signal<Country[]>([]),
      province$: signal<Province[]>([]),
      city$: signal<string[]>([]),
      timezone$: signal<string[]>([])
    } as const;

    const systemTimeZone = DateTime.now().zoneName;
    const form = new FormGroup({
      summary: new FormControl('', [Validators.required]),
      country: new FormControl<Country>(null as unknown as Country, {
        validators: [
          Validators.required,
          c => {
            if (typeof c.value === 'string') {
              return { invalid: true }
            }
            return null;
          }
        ],
        nonNullable: true
      }),
      province: new FormControl<Province>(null as unknown as Province, {
        validators: [
          Validators.required,
          c => {
            if (typeof c.value === 'string') {
              return { invalid: true }
            }
            return null;
          }
        ],
        nonNullable: true
      }),
      city: new FormControl('', {
        validators: [
          Validators.required,
          c => {
            if (!allOptions.city$().includes(c.value)) {
              return { invalid: true }
            }
            return null;
          }
        ],
        nonNullable: true
      }),
      timezone: new FormControl(systemTimeZone, [Validators.required])
    });

    const loading = {
      geo: this.loading.has('getting geolocation'),
      countries: this.loading.has('getting countries'),
      provinces: this.loading.has('getting provinces'),
      cities: this.loading.has('getting cities'),
      timezone: this.loading.has('getting timezone'),
    };

    const showSpinner = {
      country$: computed(() => loading.geo() || loading.countries()),
      province$: computed(() => loading.geo() || loading.provinces()),
      city$: computed(() => loading.geo() || loading.cities()),
      timezone$: computed(() => loading.geo() || loading.timezone()),
    }

    const validity = {
      country: statusSignal(form.controls.country),
      province: statusSignal(form.controls.province),
    }

    const values = {
      country: valueSignal(form.controls.country),
      province: valueSignal(form.controls.province),
      city: valueSignal(form.controls.city)
    }

    const filteredOptions = {
      country$: computed(() => {
        const value = values.country() as Country | string;
        const all = allOptions.country$();
        if (typeof value === 'string') {
          const filter = value.toLowerCase();
          return all.filter(c => c.name.toLowerCase().includes(filter));
        }
        return all;
      }),
      province$: computed(() => {
        const value = values.province() as Province | string;
        const all = allOptions.province$();
        if (typeof value === "string") {
          const filter = value.toLowerCase();
          return all.filter(p => p.name.toLowerCase().includes(filter));
        }
        return all;
      }),
      city$: computed(() => {
        const value = values.city();
        const all = allOptions.city$();
        if (value) {
          const filter = value.toLowerCase();
          const filtered = all.filter(c => c.toLowerCase().includes(filter));
          if (filtered.length === 1 && filtered[0] === value) {
            return all;
          }
          return filtered;
        }
        return all;
      })
    }

    const optionsSelected = {
      country: () => {
        this.getProvinces();
      },
      province: () => {
        this.getCities();
      }
    }

    const disabled = {
      country$: computed(() => showSpinner.country$()),
      province$: computed(() => showSpinner.province$() || validity.country() !== 'VALID'),
      city$: computed(() => showSpinner.city$() || validity.province() !== 'VALID'),
      // timezone$: computed(() => showSpinner.timezone$() || validity.country() !== 'VALID'),
    }

    const displayWith = {
      country: (c?: Country) => c?.name || '',
      province: (p?: Province) => p?.name || '',
    }

    const trackBy = {
      country: (_: number, c: Country) => c.code,
      province: (_: number, p: Province) => p.iso
    }


    effect(() => {
      const step = this.stepper.step$();
      if (step !== 'professional-summary')
        return;

      if (allOptions.country$().length === 0) {
        this.getCountries();
      }
    }, { allowSignalWrites: true });
    effect(() => disabled.country$() ? form.controls.country.disable() : form.controls.country.enable(), { allowSignalWrites: true });
    effect(() => disabled.province$() ? form.controls.province.disable() : form.controls.province.enable(), { allowSignalWrites: true });
    effect(() => disabled.city$() ? form.controls.city.disable() : form.controls.city.enable(), { allowSignalWrites: true });
    // effect(() => disabled.timezone$() ? form.controls.timezone.disable() : form.controls.timezone.enable(), { allowSignalWrites: true });

    return {
      form,
      loading: {
        showSpinner,
        disabled
      },
      options: {
        all: allOptions,
        filtered: filteredOptions,
        select: optionsSelected
      },
      useCurrentLocation: async () => {
        this.loading.add('getting geolocation');
        // const pos = await this.geo.get();

        // now that we have gotten the coords
        // or gotten null
        // we have to send these off to the api to
        // figure out where the user is
        // then populate the form with those values

        throw new Error('not implemented');

      },
      displayWith,
      trackBy,
    } as const;
  }

  private initPrimaryDomains() {
    type FormType = FormGroup<{
      domain: FormControl<SelectableOption<Domain>>,
      years: FormControl<number>
    }>
    const form = new FormArray<FormType>([], {
      validators: [
        Validators.minLength(1),
        Validators.maxLength(3)
      ]
    });

    const values = valueSignal(form);
    const length$ = computed(() => {
      values();
      return form.length;
    });

    const filterText$ = signal('');
    const options$ = computed(() => this.domains.domains$().map(d => {
      const opt: SelectableOption<Domain> = {
        selected: false,
        value: d,
        label: d.shortName,
        title: d.longName,
      }
      return opt;
    }));
    const filtered$ = computed(() => {
      const filter = filterText$().toLowerCase();
      const all = options$();
      if (filter)
        return all.filter(i =>
          i.value.shortName.toLowerCase().includes(filter) ||
          i.value.longName.toLowerCase().includes(filter));
      return all;
    });

    return {
      form,
      options: {
        filterText$,
        all$: options$,
        filtered$,
        loading$: this.domains.loading$,
        visible$: computed(() => length$() < 3)
      },
      trackBy: {
        controls: (_: number, form: FormType) => form.value.domain?.value.shortName,
        options: (_: number, opt: SelectableOption<Domain>) => opt.value.shortName
      },
      select: (option: SelectableOption<Domain>) => {
        option.selected = true;

        form.push(new FormGroup({
          domain: new FormControl(option, {
            validators: [Validators.required],
            nonNullable: true
          }),
          years: new FormControl(null as unknown as number, {
            validators: [
              Validators.required,
              Validators.min(1),
              Validators.max(30)
            ],
            nonNullable: true
          }),
        }));

        form.controls.sort((a, b) =>
          sortString(
            a.value.domain?.value.longName ?? '',
            b.value.domain?.value.longName ?? ''
          ));
      },
      remove: (i: number) => {
        const value = form.at(i).getRawValue();
        value.domain.selected = false;
        form.removeAt(i);
      }
    } as const;
  }

  private async devModeInit() {
    if (!isDevMode())
      return;

    const injector = this.injector;

    const revert = [] as (() => void)[];

    {
      this.stepper.next.click();
    }

    {
      const form = this.professionalSummary.form;
      const keys = Object.keys(form.controls) as (keyof typeof this.professionalSummary.form.controls)[]

      const validators = keys.map(key => [
        key,
        form.controls[key].validator
      ] as const);

      keys.forEach(key => form.controls[key].clearValidators());

      revert.push(() => {
        validators.forEach(([key, validator]) => form.controls[key].validator = validator);
      });

      this.stepper.next.click();
    }

    {
      const all = await firstValueFrom(toObservable(this.primaryDomains.options.all$, { injector })
        .pipe(filter(all => all.length > 0)));

      this.primaryDomains.select(all[0]);
      this.primaryDomains.select(all[1]);

      this.primaryDomains.form.at(0).controls.years.setValue(2);
      this.primaryDomains.form.at(1).controls.years.setValue(3);

      this.stepper.next.click();
    }

    revert.forEach(r => r());
  }

  private getCountries() {
    this.loading.add('getting countries');

    this.api.location.countries()
      .subscribe({
        next: c => {
          this.professionalSummary.options.all.country$.set(c);
          this.loading.delete('getting countries');
        },
        error: () => {
          this.loading.delete('getting countries');
        }
      })
  }

  private getProvinces() {
    this.professionalSummary.form.controls.province.reset(null as unknown as Province);
    this.professionalSummary.form.controls.city.reset('');

    const control = this.professionalSummary.form.controls.country;
    if (!control.valid)
      return;

    const country = control.value;

    this.loading.add('getting provinces');
    this.api.location.provinces(country.code)
      .subscribe({
        next: p => {
          this.professionalSummary.options.all.province$.set(p);
          this.loading.delete('getting provinces');
        },
        error: () => {
          this.loading.delete('getting provinces');
        }
      })
  }

  private getCities() {
    this.professionalSummary.form.controls.city.reset('');

    const control = {
      country: this.professionalSummary.form.controls.country,
      province: this.professionalSummary.form.controls.province
    };
    if (!control.country.valid || !control.province.valid)
      return;

    const country = control.country.value;
    const province = control.province.value;

    this.loading.add('getting cities');
    this.api.location.cities(country.code, province.iso)
      .subscribe({
        next: c => {
          this.professionalSummary.options.all.city$.set(c);
          this.loading.delete('getting cities');
        },
        error: () => {
          this.loading.delete('getting cities');
        }
      })
  }

  ngOnInit(): void {
    this.devModeInit();
  }
}

type Step =
  'start' |
  'professional-summary' |
  'primary-domains' |
  'services' |
  'modules' |
  'software' |
  'roles' |
  'technology-stack' |
  'industry' |
  'job-search-status' |
  'expectations' |
  'about' |
  'social' |
  'end';