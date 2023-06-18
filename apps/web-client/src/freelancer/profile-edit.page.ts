import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, Signal, WritableSignal, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { Ctrl, Domain, DomainState, FormImports, GeoLocationService, ImportsModule, LocationApi, LottiePlayerDirective, SelectableOption, generateLoadingState, sleep, sortString, statusSignal, valueChangesWithCurrent, valueSignal } from '@easworks/app-shell';
import { City, Country, ICity, ICountry, IState, State } from 'country-state-city';
import { Timezones } from 'country-state-city/lib/interface';
import { Observable, filter, firstValueFrom, map } from 'rxjs';

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
    'getting primary domains'
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly section = this.initSection();

  protected readonly professionalSummary = this.initProfessionaSummary();
  protected readonly primaryDomains = this.initPrimaryDomains();
  protected readonly services = this.initServices();

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

    const nextDisabled$ = computed(() => {
      const step = step$();
      return this.loading.any$() ||
        (step === 'professional-summary' && this.professionalSummary.status$() !== 'VALID') ||
        (step === 'primary-domains' && this.primaryDomains.status$() !== 'VALID') ||
        (step === 'services' && this.services.$().status$() !== 'VALID');
    });

    return {
      totalSteps,
      step$,
      showStepControls$,
      progress$: computed(() => {
        const s = stepProgress$();
        return {
          label: `Step ${s} of ${totalSteps}`,
          percent: ((s - 1) / totalSteps) * 100
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

    const isObject = (control: AbstractControl) => {
      if (control.value && typeof control.value === 'object')
        return null;
      return { required: true };
    };

    const form = new FormGroup({
      summary: new FormControl('', [Validators.required]),
      country: new FormControl(null as unknown as ICountry, {
        validators: [isObject],
        nonNullable: true
      }),
      state: new FormControl(null as unknown as IState, {
        validators: [isObject],
        nonNullable: true
      }),
      city: new FormControl(null as unknown as ICity, {
        validators: [isObject],
        nonNullable: true
      }),
      timezone: new FormControl(null as unknown as Timezones, {
        validators: [isObject],
        nonNullable: true
      })
    });

    const values = {
      country: valueSignal(form.controls.country),
      state: valueSignal(form.controls.state),
      city: valueSignal(form.controls.city),
      timezone: valueSignal(form.controls.timezone)
    }

    const status = {
      country: statusSignal(form.controls.country),
      state: statusSignal(form.controls.state),
    }

    const loadingGeo$ = this.loading.has('getting geolocation');

    const allOptions = {
      country: Country.getAllCountries(),
      state$: signal<IState[]>([]),
      city$: signal<ICity[]>([]),
      timezone$: signal<Timezones[]>([]),
    };

    const filteredOptions = {
      country$: computed(() => {
        const value = values.country() as ICountry | string;
        const all = allOptions.country;
        if (typeof value === 'string') {
          const filter = value.trim().toLowerCase();
          return all.filter(c => c.name.toLowerCase().includes(filter));
        }
        return all;
      }),
      state$: computed(() => {
        const value = values.state() as IState | string;
        const all = allOptions.state$();
        if (typeof value === 'string') {
          const filter = value.trim().toLowerCase();
          return all.filter(s => s.name.toLowerCase().includes(filter));
        }
        return all;
      }),
      city$: computed(() => {
        const value = values.city() as ICity | string;
        const all = allOptions.city$();
        if (typeof value === 'string') {
          const filter = value.trim().toLowerCase();
          return all.filter(c => c.name.toLowerCase().includes(filter));
        }
        return all;

      }),
      timezone$: computed(() => {
        const value = values.timezone() as Timezones | string;
        const all = allOptions.timezone$();
        if (typeof value === 'string') {
          const filter = value.trim().toLowerCase();
          return all.filter(c => c.zoneName.toLowerCase().includes(filter));
        }
        return all;
      })
    }

    const displayWith = {
      country: (c?: ICountry) => c?.name || '',
      state: (s?: IState) => s?.name || '',
      city: (c?: ICity) => c?.name || '',
      timezone: (t?: Timezones) => t?.zoneName || ''
    }

    const trackBy = {
      country: (_: number, c: ICountry) => c.isoCode,
      state: (_: number, s: IState) => s.isoCode,
    }

    const disabled = {
      country$: computed(() => loadingGeo$()),
      state$: computed(() => loadingGeo$() || status.country() !== 'VALID' || allOptions.state$().length === 0),
      city$: computed(() => loadingGeo$() || status.state() !== 'VALID' || allOptions.city$().length === 0),
      timezone$: computed(() => loadingGeo$() || status.country() !== 'VALID' || allOptions.timezone$().length === 0),
    }

    effect(() => disabled.country$() ? form.controls.country.disable() : form.controls.country.enable(), { allowSignalWrites: true });
    effect(() => disabled.state$() ? form.controls.state.disable() : form.controls.state.enable(), { allowSignalWrites: true });
    effect(() => disabled.city$() ? form.controls.city.disable() : form.controls.city.enable(), { allowSignalWrites: true });
    effect(() => disabled.timezone$() ? form.controls.timezone.disable() : form.controls.timezone.enable(), { allowSignalWrites: true });

    effect(() => {
      const country = values.country();
      form.controls.state.reset();
      form.controls.city.reset();
      form.controls.timezone.reset();

      let stateOpts: IState[] = [];
      let tzOpts: Timezones[] = [];

      if (status.country() === 'VALID') {
        const states = State.getStatesOfCountry(country.isoCode);
        stateOpts = states;
        tzOpts = country.timezones || [];
      }

      allOptions.state$.set(stateOpts);
      allOptions.timezone$.set(tzOpts);
    }, { allowSignalWrites: true });

    effect(() => {
      const state = values.state();
      form.controls.city.reset();

      let cityOpts: ICity[] = [];

      if (status.state() === 'VALID') {
        if (state && typeof state === 'object')
          cityOpts = City.getCitiesOfState(state.countryCode, state.isoCode);
      }
      else if (status.country() === 'VALID') {
        if (allOptions.state$().length === 0) {
          cityOpts = City.getCitiesOfCountry(values.country().isoCode) || [];
        }
      }
      allOptions.city$.set(cityOpts);
    }, { allowSignalWrites: true });


    // automatically select first option when appropriate
    effect(() => {
      const all = allOptions.state$();
      if (all.length === 1)
        form.controls.state.reset(all[0]);
    }, { allowSignalWrites: true });
    effect(() => {
      const all = allOptions.city$();
      if (all.length === 1)
        form.controls.city.reset(all[0]);
    }, { allowSignalWrites: true });
    effect(() => {
      const all = allOptions.timezone$();
      if (all.length === 1)
        form.controls.timezone.reset(all[0]);
    }, { allowSignalWrites: true })

    const status$ = statusSignal(form);
    return {
      form,
      status$,
      loading: {
        geo$: loadingGeo$,
      },
      options: {
        all: allOptions,
        filtered: filteredOptions,
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
      showFlag$: computed(() => {
        const v = values.country();
        return !!v && typeof v !== 'string';
      })
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
        label: d.key,
        title: d.longName,
      }
      return opt;
    }));
    const filtered$ = computed(() => {
      const filter = filterText$().toLowerCase();
      const all = options$();
      if (filter)
        return all.filter(i =>
          i.value.key.toLowerCase().includes(filter) ||
          i.value.longName.toLowerCase().includes(filter));
      return all;
    });

    const status$ = statusSignal(form);
    return {
      form,
      status$,
      options: {
        filterText$,
        all$: options$,
        filtered$,
        loading$: this.domains.loading$,
        visible$: computed(() => length$() < 3)
      },
      trackBy: {
        controls: (_: number, form: FormType) => form.value.domain?.value.key,
        options: (_: number, opt: SelectableOption<Domain>) => opt.value.key
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
        }), { emitEvent: false });

        form.controls.sort((a, b) =>
          sortString(
            a.value.domain?.value.longName ?? '',
            b.value.domain?.value.longName ?? ''
          ));
        form.updateValueAndValidity();
      },
      remove: (i: number) => {
        const value = form.at(i).getRawValue();
        value.domain.selected = false;
        form.removeAt(i);
      }
    } as const;
  }

  private initServices() {
    const injector = this.injector;

    const form$ = valueChangesWithCurrent(this.primaryDomains.form)
      .pipe(
        filter(() => this.primaryDomains.form.valid),
        map(selected => {
          const exists = this.services ? this.services.$() : undefined;

          const domains = this.primaryDomains.form.valid ?
            selected.map(s => s.domain.value) :
            [];

          const mapped = domains.map(d => {
            if (exists) {
              const found = exists.form.controls.findIndex(c => c.value.domain?.key === d.key);

              if (found >= 0) {
                const group = exists.form.controls[found] as FormGroup<{
                  domain: FormControl<Domain>;
                  services: FormArray<FormGroup<{
                    service: FormControl<SelectableOption<string>>;
                    years: FormControl<number>;
                  }>>;
                }>;
                const options = exists.options[found] as {
                  visible$: Signal<boolean>;
                  add: (option: SelectableOption<string>) => Promise<void>;
                  remove: (i: number) => void;
                  query$: WritableSignal<string>;
                  filtered$: Signal<{
                    selected: false;
                    value: string;
                  }[]>;
                };

                return { group, options };
              }
            }


            const services = d.services.map(s => ({
              selected: false,
              value: s
            } satisfies SelectableOption<string>));

            const serviceForms = new FormArray<FormGroup<{
              service: FormControl<SelectableOption<string>>,
              years: FormControl<number>
            }>>([],);
            const values = valueSignal(serviceForms, injector);
            const servicesLength = computed(() => values().length);
            const showInput = computed(() => servicesLength() < 7);

            const group = new FormGroup({
              domain: new FormControl(d, { nonNullable: true }),
              services: serviceForms
            });

            const serviceFilter$ = signal('');
            const filtered$ = computed(() => {
              const length = servicesLength();
              const value = serviceFilter$();
              const filter = typeof value === 'string' ? value.trim().toLowerCase() : '';
              if (filter || length) {
                return services.filter(s =>
                  !s.selected &&
                  (!filter || s.value.toLowerCase().includes(filter)));
              }
              return services;
            });

            const handlers = {
              add: async (option: SelectableOption<string>) => {
                option.selected = true;

                serviceForms.push(new FormGroup({
                  service: new FormControl(option, { nonNullable: true }),
                  years: new FormControl(null as unknown as number, {
                    validators: [Validators.required, Validators.min(1), Validators.max(30)],
                    nonNullable: true
                  })
                }), { emitEvent: false });

                serviceForms.controls.sort((a, b) =>
                  sortString(
                    a.controls.service.value.value,
                    b.controls.service.value.value
                  ));
                serviceForms.updateValueAndValidity();

              },
              remove: (i: number) => {
                const control = serviceForms.at(i);
                control.getRawValue().service.selected = false;
                serviceForms.removeAt(i);
              }
            } as const;

            return {
              group,
              options: {
                query$: serviceFilter$,
                filtered$,
                ...handlers,
                visible$: showInput
              }
            }
          })

          const form = new FormArray(mapped.map(m => m.group));
          const status$ = statusSignal(form, injector);

          return {
            form,
            options: mapped.map(m => m.options),
            status$
          }
        }));

    const displayWith = {
      none: () => ''
    } as const;

    type ObsType = typeof form$ extends Observable<infer T> ? T : never;
    type FormType = ObsType['form'];

    const trackBy = {
      domains: (_: number, control: Ctrl<FormType>) => control.value.domain?.key,
      controls: (_: number, control: Ctrl<Ctrl<Ctrl<FormType>>['services']>) =>
        control.value.service?.value,
      service: (_: number, option: SelectableOption<string>) => option.value
    } as const;

    const $ = toSignal(form$, { requireSync: true });

    return {
      $,
      displayWith,
      trackBy,
    }
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
      form.controls.summary.reset('some professional summary');

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const country = Country.getCountryByCode('IN')!;
      const state = country && State.getStateByCodeAndCountry('WB', country.isoCode);
      const city = state && City.getCitiesOfState(state.countryCode, state.isoCode)
        .find(c => c.name === 'Kolkata');

      form.controls.country.reset(country);
      await sleep();
      form.controls.state.reset(state);
      await sleep();
      form.controls.city.reset(city);
      form.controls.timezone.reset(this.professionalSummary.options.all.timezone$()[0]);

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