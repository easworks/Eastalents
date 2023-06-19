import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, Signal, WritableSignal, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Ctrl, Domain, DomainModule, DomainProduct, DomainState, FormImports, GeoLocationService, ImportsModule, LocationApi, LottiePlayerDirective, SelectableOption, controlStatus$, controlValue$, generateLoadingState, sleep, sortString, toPromise } from '@easworks/app-shell';
import { FreelancerProfile, OVERALL_EXPERIENCE_OPTIONS } from '@easworks/models';
import { City, Country, ICity, ICountry, IState, State } from 'country-state-city';
import { Timezones } from 'country-state-city/lib/interface';
import { Observable, map, shareReplay, switchMap } from 'rxjs';

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
    MatAutocompleteModule,
    MatSelectModule
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
  protected readonly modules = this.initModules();
  protected readonly software = this.initSoftware();

  protected readonly stepper = this.initStepper();

  private initStepper() {
    const step$ = signal<Step>(this.section ?? 'start');

    const showStepControls$ = computed(() => {
      if (this.section)
        return false;

      const step = step$();
      return step !== 'start' && step !== 'end';
    });


    const totalSteps = 5;
    const stepProgress$ = computed(() => {
      switch (step$()) {
        case 'professional-summary': return 1;
        case 'primary-domains': return 2;
        case 'services': return 3;
        case 'modules': return 4;
        case 'software': return 5;
        default: return 0;
      }
    });

    const nextDisabled$ = computed(() => {
      const step = step$();
      return this.loading.any$() ||
        (step === 'professional-summary' && this.professionalSummary.status$() !== 'VALID') ||
        (step === 'primary-domains' && this.primaryDomains.status$() !== 'VALID') ||
        (step === 'services' && this.services.$()?.status$() !== 'VALID') ||
        (step === 'modules' && this.modules.$()?.status$() !== 'VALID') ||
        (step === 'software' && this.software.$()?.status$() !== 'VALID');
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
            case 'primary-domains': return step$.set('services');
            case 'services': return step$.set('modules');
            case 'modules': return step$.set('software');
          }
        }
      },
      prev: {
        visible$: computed(() => step$() !== 'professional-summary'),
        click: () => {
          switch (step$()) {
            case 'primary-domains': return step$.set('professional-summary');
            case 'services': return step$.set('primary-domains');
            case 'modules': return step$.set('services');
            case 'software': return step$.set('modules');
          }
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

    const summaryWords$ = signal(0);

    const form = new FormGroup({
      summary: new FormControl('', {
        validators: [
          Validators.required,
          (c) => {
            const v = c.value as string;
            const w = v && v.length && v.split(/\s+\b/).length || 0;
            summaryWords$.set(w);
            if (w > 250)
              return { wordlength: true }
            return null;
          }
        ],
        nonNullable: true
      }),
      experience: new FormControl(null as unknown as FreelancerProfile['overallExperience'], {
        validators: [Validators.required],
        nonNullable: true
      }),
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
      summary: toSignal(controlValue$(form.controls.summary), { requireSync: true }),
      country: toSignal(controlValue$(form.controls.country), { requireSync: true }),
      state: toSignal(controlValue$(form.controls.state), { requireSync: true }),
      city: toSignal(controlValue$(form.controls.city), { requireSync: true }),
      timezone: toSignal(controlValue$(form.controls.timezone), { requireSync: true })
    }

    const status = {
      country: toSignal(controlStatus$(form.controls.country), { requireSync: true }),
      state: toSignal(controlStatus$(form.controls.state), { requireSync: true }),
    }

    const loadingGeo$ = this.loading.has('getting geolocation');

    const allOptions = {
      country: Country.getAllCountries(),
      state$: signal<IState[]>([]),
      city$: signal<ICity[]>([]),
      timezone$: signal<Timezones[]>([]),
      experience: OVERALL_EXPERIENCE_OPTIONS
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

    const status$ = toSignal(controlStatus$(form), { requireSync: true });
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
      }),
      summaryWords$
    } as const;
  }

  private initPrimaryDomains() {
    type FormType = FormGroup<{
      domain: FormControl<SelectableOption<Domain>>,
      years: FormControl<number>
    }>
    const form = new FormArray<FormType>([], {
      validators: [
        Validators.required,
        Validators.maxLength(3)
      ]
    });

    const values = toSignal(controlValue$(form), { requireSync: true });
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

    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const selected$ = controlValue$(form, true)
      .pipe(
        map(v => v.map(s => s.domain.value)),
        shareReplay({ refCount: true, bufferSize: 1 }));

    return {
      form,
      status$,
      selected$,
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
      },
    } as const;
  }

  private initServices() {
    const injector = this.injector;

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(selected => {
          const exists = this.services && this.services.$();

          const domainLabel = (selected.length === 1 && selected[0].longName) || 'Domain';

          const mapped = selected.map(d => {
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
                  add: (option: SelectableOption<string>) => void;
                  remove: (i: number) => void;
                  query$: WritableSignal<string>;
                  filtered$: Signal<SelectableOption<string>[]>;
                };

                return { group, options } as const;
              }
            }


            const services = d.services.map((s): SelectableOption<string> => ({
              selected: false,
              value: s,
              label: s
            }));

            const serviceForms = new FormArray<FormGroup<{
              service: FormControl<SelectableOption<string>>,
              years: FormControl<number>
            }>>([], { validators: [Validators.required] });

            const values = toSignal(controlValue$(serviceForms), { requireSync: true, injector });
            const servicesLength = computed(() => values().length);
            const totalLength = services.length
            const showInput = computed(() => servicesLength() < totalLength);

            const group = new FormGroup({
              domain: new FormControl(d, { nonNullable: true }),
              services: serviceForms
            });

            const serviceFilter$ = signal('');
            const filtered$ = computed(() => {
              const length = servicesLength();
              const value = serviceFilter$();
              const filter = typeof value === 'string' && value.trim().toLowerCase() || '';
              if (filter || length) {
                return services.filter(s =>
                  !s.selected &&
                  (!filter || s.value.toLowerCase().includes(filter)));
              }
              return services;
            });

            const handlers = {
              add: (option: SelectableOption<string>) => {
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
            } as const;
          });

          const form = new FormArray(mapped.map(m => m.group));
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });
          const options = mapped.map(m => m.options);

          return { form, status$, options, domainLabel } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 }));

    const $ = toSignal(obs$);

    const displayWith = {
      none: () => ''
    } as const;

    type ObsType = typeof obs$ extends Observable<infer T> ? T : never;
    type FormType = ObsType['form'];

    const trackBy = {
      domain: (_: number, control: Ctrl<FormType>) => control.value.domain?.key,
      controls: (_: number, control: Ctrl<Ctrl<Ctrl<FormType>>['services']>) =>
        control.value.service?.value,
      service: (_: number, option: SelectableOption<string>) => option.value
    } as const;

    return { $, displayWith, trackBy } as const;
  }

  private initModules() {
    const injector = this.injector;

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(selected => {
          const exists = this.modules && this.modules.$();
          const domainLabel = (selected.length === 1 && selected[0].longName) || 'Domain';

          const mapped = selected.map(d => {
            if (exists) {
              const found = exists.form.controls.findIndex(c => c.value.domain?.key === d.key);
              if (found >= 0) {
                const group = exists.form.controls[found] as FormGroup<{
                  domain: FormControl<Domain>;
                  modules: FormArray<FormControl<SelectableOption<DomainModule>>>;
                }>;
                const options = exists.options[found] as {
                  visible$: Signal<boolean>;
                  add: (option: SelectableOption<DomainModule>) => void;
                  remove: (i: number) => void;
                  query$: WritableSignal<string>
                  filtered$: Signal<SelectableOption<DomainModule>[]>;
                }
                return { group, options } as const;
              }
            }

            const modules = d.modules.map((m): SelectableOption<DomainModule> => ({
              selected: false,
              value: m,
              label: m.name,
            }));

            const moduleForms = new FormArray<FormControl<SelectableOption<DomainModule>>>(
              [],
              { validators: [Validators.required, Validators.maxLength(7)] }
            );

            const values = toSignal(controlValue$(moduleForms), { requireSync: true, injector });
            const modulesLength = computed(() => values().length);
            const totalLength = modules.length
            const showInput = computed(() => {
              const l = modulesLength();
              return l < totalLength && l < 7;
            });

            const group = new FormGroup({
              domain: new FormControl(d, { nonNullable: true }),
              modules: moduleForms
            });

            const moduleFilter$ = signal('');
            const filtered$ = computed(() => {
              const length = modulesLength();
              const value = moduleFilter$();
              const filter = typeof value === 'string' ? value.trim().toLowerCase() : '';
              if (filter || length) {
                return modules.filter(m =>
                  !m.selected &&
                  (!filter || m.value.name.toLowerCase().includes(filter)));
              }
              return modules;
            });

            const handlers = {
              add: (option: SelectableOption<DomainModule>) => {
                option.selected = true;

                moduleForms.push(new FormControl(option, { nonNullable: true }), { emitEvent: false });
                moduleForms.controls.sort((a, b) => sortString(a.value.value.name, b.value.value.name));
                moduleForms.updateValueAndValidity();
              },
              remove: (i: number) => {
                const control = moduleForms.at(i);
                control.getRawValue().selected = false;
                moduleForms.removeAt(i);
              }
            } as const;

            return {
              group,
              options: {
                query$: moduleFilter$,
                filtered$,
                ...handlers,
                visible$: showInput
              }
            }
          });

          const form = new FormArray(mapped.map(m => m.group));
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });
          const options = mapped.map(m => m.options);
          const selected$ = controlValue$(form, true);

          return { form, status$, options, domainLabel, selected$ } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(o => o.selected$),
      shareReplay({ refCount: true, bufferSize: 1 }));

    const displayWith = {
      none: () => ''
    } as const;

    type ObsType = typeof obs$ extends Observable<infer T> ? T : never;
    type FormType = ObsType['form'];

    const trackBy = {
      domain: (_: number, control: Ctrl<FormType>) => control.value.domain?.key,
      controls: (_: number, control: Ctrl<Ctrl<Ctrl<FormType>>['modules']>) => control.value.value.name,
      module: (_: number, option: SelectableOption<DomainModule>) => option.value.name
    } as const;

    return { $, displayWith, trackBy, selected$ } as const;
  }

  private initSoftware() {
    const injector = this.injector;

    const obs$ = this.modules.selected$
      .pipe(
        map(selected => {
          const exists = this.software && this.software.$();

          const domainLabel = (selected.length === 1 && selected[0].domain.longName) || 'Domain';

          const mapped = selected.map(d => {
            if (exists) {
              const found = exists.form.controls.findIndex(c => c.value.domain?.key === d.domain.key);
              if (found >= 0) {
                const group = exists.form.controls[found] as FormGroup<{
                  domain: FormControl<Domain>;
                  software: FormArray<FormGroup<{
                    software: FormControl<SelectableOption<DomainProduct>>;
                    years: FormControl<number>;
                  }>>;
                }>;
                const options = exists.options[found] as {
                  visible$: Signal<boolean>;
                  add: (option: SelectableOption<DomainProduct>) => void;
                  remove: (i: number) => void;
                  query$: WritableSignal<string>;
                  filtered$: Signal<SelectableOption<DomainProduct>[]>;
                };
                return { group, options };
              }
            }

            const softwareMap = new Map<string, DomainProduct>();
            d.modules
              .forEach(m => m.value.products
                .forEach(p => softwareMap.set(p.name, p)))

            const software = [...softwareMap.values()]
              .map((s): SelectableOption<DomainProduct> => ({
                selected: false,
                value: s,
                label: s.name
              }));


            const softwareForms = new FormArray<FormGroup<{
              software: FormControl<SelectableOption<DomainProduct>>,
              years: FormControl<number>
            }>>([], { validators: [Validators.required, Validators.maxLength(5)] })

            const values = toSignal(controlValue$(softwareForms), { requireSync: true, injector });
            const softwareLength = computed(() => values().length);
            const totalLength = software.length;
            const showInput = computed(() => {
              const l = softwareLength();
              return l < totalLength && l < 5
            });

            const group = new FormGroup({
              domain: new FormControl(d.domain, { nonNullable: true }),
              software: softwareForms
            });

            const softwareFilter$ = signal('');
            const filtered$ = computed(() => {
              const length = softwareLength();
              const value = softwareFilter$();
              const filter = typeof value === 'string' && value.trim().toLowerCase() || '';
              if (filter || length) {
                return software.filter(s =>
                  !s.selected &&
                  (!filter || s.value.name.toLowerCase().includes(filter)));
              }
              return software;
            });

            const handlers = {
              add: (option: SelectableOption<DomainProduct>) => {
                option.selected = true;

                softwareForms.push(new FormGroup({
                  software: new FormControl(option, { nonNullable: true }),
                  years: new FormControl(null as unknown as number, {
                    validators: [Validators.required, Validators.min(1), Validators.max(30)],
                    nonNullable: true
                  })
                }), { emitEvent: false });
                softwareForms.controls.sort((a, b) => sortString(
                  a.controls.software.value.value.name,
                  b.controls.software.value.value.name
                ));
                softwareForms.updateValueAndValidity();
              },
              remove: (i: number) => {
                const control = softwareForms.at(i);
                control.getRawValue().software.selected = false;
                softwareForms.removeAt(i);
              }
            } as const;

            return {
              group,
              options: {
                query$: softwareFilter$,
                filtered$,
                ...handlers,
                visible$: showInput
              }
            }
          });

          const form = new FormArray(mapped.map(m => m.group));
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });
          const options = mapped.map(m => m.options);

          return { form, options, status$, domainLabel } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 }),
      );

    const $ = toSignal(obs$);

    const displayWith = {
      none: () => ''
    } as const;

    type ObsType = typeof obs$ extends Observable<infer T> ? T : never;
    type FormType = ObsType['form'];

    const trackBy = {
      domain: (_: number, control: Ctrl<FormType>) => control.value.domain?.key,
      controls: (_: number, control: Ctrl<Ctrl<Ctrl<FormType>>['software']>) =>
        control.value.software?.value.name,
      software: (_: number, option: SelectableOption<DomainProduct>) => option.value.name
    } as const;

    return { $, displayWith, trackBy } as const;
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
      form.reset({
        summary: 'some professional summary',
        experience: '2 to 5 years'
      })

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
      const all = await toPromise(
        this.primaryDomains.options.all$,
        all => all.length > 0,
        injector
      );

      this.primaryDomains.select(all[0]);
      this.primaryDomains.select(all[1]);

      this.primaryDomains.form.at(0).controls.years.setValue(2);
      this.primaryDomains.form.at(1).controls.years.setValue(3);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options, form } = this.services.$()!;

      const [s0o0, s0o1] = options[0].filtered$();
      options[0].add(s0o0);
      options[0].add(s0o1);

      const [s1o0, s1o1] = options[1].filtered$();
      options[1].add(s1o0);
      options[1].add(s1o1);

      form.at(0).controls.services.at(0).controls.years.setValue(2);
      form.at(0).controls.services.at(1).controls.years.setValue(2);
      form.at(1).controls.services.at(0).controls.years.setValue(2);
      form.at(1).controls.services.at(1).controls.years.setValue(2);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options } = this.modules.$()!;

      const [s0o0, s0o1] = options[0].filtered$();
      options[0].add(s0o0);
      options[0].add(s0o1);

      const [s1o0, s1o1] = options[1].filtered$();
      options[1].add(s1o0);
      options[1].add(s1o1);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options, form } = this.software.$()!;

      const [s0o0, s0o1] = options[0].filtered$();
      options[0].add(s0o0);
      options[0].add(s0o1);

      const [s1o0] = options[1].filtered$();
      options[1].add(s1o0);

      form.at(0).controls.software.at(0).controls.years.setValue(2);
      form.at(0).controls.software.at(1).controls.years.setValue(2);
      form.at(1).controls.software.at(0).controls.years.setValue(2);

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