import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
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
  constructor() {
    this.getData()
  }

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
    'getting data'
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  protected readonly loadingData$ = this.loading.has('getting data');
  private readonly section = this.initSection();

  protected readonly professionalSummary = this.initProfessionaSummary();
  protected readonly primaryDomains = this.initPrimaryDomains();
  protected readonly services = this.initServices();
  protected readonly modules = this.initModules();
  protected readonly software = this.initSoftware();
  protected readonly roles = this.initRoles();
  protected readonly techExp = this.initTechExp();
  protected readonly industries = this.initIndustries();

  protected readonly stepper = this.initStepper();

  private initStepper() {
    const step$ = signal<Step>(this.section ?? 'start');

    const showStepControls$ = computed(() => {
      if (this.section)
        return false;

      const step = step$();
      return step !== 'start' && step !== 'end';
    });


    const totalSteps = 8;
    const stepProgress$ = computed(() => {
      switch (step$()) {
        case 'professional-summary': return 1;
        case 'primary-domains': return 2;
        case 'services': return 3;
        case 'modules': return 4;
        case 'software': return 5;
        case 'roles': return 6;
        case 'technology-stack': return 7;
        case 'industry': return 8;
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
        (step === 'software' && this.software.$()?.status$() !== 'VALID') ||
        (step === 'roles' && this.roles.$()?.status$() !== 'VALID') ||
        (step === 'technology-stack' && this.techExp.status$() !== 'VALID') ||
        (step === 'industry' && this.industries.status$() !== 'VALID');
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
            case 'start': step$.set('professional-summary'); break;
            case 'professional-summary': step$.set('primary-domains'); break;
            case 'primary-domains': step$.set('services'); break;
            case 'services': step$.set('modules'); break;
            case 'modules': step$.set('software'); break;
            case 'software': step$.set('roles'); break;
            case 'roles': step$.set('technology-stack'); break;
            case 'technology-stack': step$.set('industry'); break;
          }
          document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
        }
      },
      prev: {
        visible$: computed(() => step$() !== 'professional-summary'),
        click: () => {
          switch (step$()) {
            case 'primary-domains': step$.set('professional-summary'); break;
            case 'services': step$.set('primary-domains'); break;
            case 'modules': step$.set('services'); break;
            case 'software': step$.set('modules'); break;
            case 'roles': step$.set('software'); break;
            case 'technology-stack': step$.set('roles'); break;
            case 'industry': step$.set('technology-stack'); break;
          }
          document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
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

    const stepLabel$ = toSignal(this.primaryDomains.selected$
      .pipe(map(selected => (selected.length === 1 && selected[0].longName) || 'Enterprise Application')),
      { initialValue: 'Enterprise Application' });

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(selected => {
          const exists = this.services?.$()?.form.getRawValue();

          const mapped = selected.map(d => {

            const serviceMap = new Map<string, SelectableOption<string>>();
            d.services.forEach(s => serviceMap.set(s, {
              selected: false,
              value: s,
              label: s
            }));

            const serviceForms = new FormArray<FormGroup<{
              service: FormControl<SelectableOption<string>>,
              years: FormControl<number>
            }>>([], { validators: [Validators.required] });

            if (exists) {
              const found = exists.find(v => v.domain.key === d.key);
              if (found) {
                found.services.forEach(s => {
                  const fs = serviceMap.get(s.service.value);
                  if (fs) {
                    fs.selected = true;
                    serviceForms.push(new FormGroup({
                      service: new FormControl(fs, { nonNullable: true }),
                      years: new FormControl(s.years, {
                        validators: [Validators.required, Validators.min(1), Validators.max(30)],
                        nonNullable: true
                      })
                    }), { emitEvent: false });
                  }
                });
                serviceForms.updateValueAndValidity();
              }
            }

            const services = [...serviceMap.values()];
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

          return { form, status$, options } as const;
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

    return { $, displayWith, trackBy, stepLabel$ } as const;
  }

  private initModules() {
    const injector = this.injector;

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(selected => {
          const exists = this.modules?.$()?.form.getRawValue();

          const domainLabel = (selected.length === 1 && selected[0].longName) || 'Domain';

          const mapped = selected.map(d => {

            const moduleMap = new Map<string, SelectableOption<DomainModule>>();
            d.modules.forEach(m => moduleMap.set(m.name, {
              selected: false,
              value: m,
              label: m.name,
            }));

            const moduleForms = new FormArray<FormControl<
              SelectableOption<DomainModule>
            >>([], { validators: [Validators.required, Validators.maxLength(7)] });

            if (exists) {
              const found = exists.find(v => v.domain.key === d.key);
              if (found) {
                found.modules.forEach(m => {
                  const fm = moduleMap.get(m.value.name);
                  if (fm) {
                    fm.selected = true;
                    moduleForms.push(
                      new FormControl(fm, { nonNullable: true }),
                      { emitEvent: false })
                  }
                });
                moduleForms.updateValueAndValidity();
              }
            }

            const modules = [...moduleMap.values()];
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
          const exists = this.software?.$()?.form.getRawValue();

          const domainLabel = (selected.length === 1 && selected[0].domain.longName) || 'Domain';

          const mapped = selected.map(d => {

            const softwareMap = new Map<string, SelectableOption<DomainProduct>>();
            d.modules
              .forEach(m => m.value.products
                .forEach(p => softwareMap.set(p.name, {
                  selected: false,
                  value: p,
                  label: p.name
                })));

            const softwareForms = new FormArray<FormGroup<{
              software: FormControl<SelectableOption<DomainProduct>>,
              years: FormControl<number>
            }>>([], { validators: [Validators.required, Validators.maxLength(5)] })

            if (exists) {
              const found = exists.find(v => v.domain.key === d.domain.key);
              if (found) {
                found.software.forEach(v => {
                  const fs = softwareMap.get(v.software.value.name);
                  if (fs) {
                    fs.selected = true;
                    softwareForms.push(
                      new FormGroup({
                        software: new FormControl(fs, { nonNullable: true }),
                        years: new FormControl(v.years, {
                          validators: [Validators.required, Validators.min(1), Validators.max(30)],
                          nonNullable: true
                        })
                      }),
                      { emitEvent: false }
                    )
                  }
                });
                softwareForms.updateValueAndValidity();
              }
            }

            const software = [...softwareMap.values()]
              .sort((a, b) => sortString(a.value.name, b.value.name));
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
          const selected$ = controlValue$(form, true);

          return { form, options, status$, domainLabel, selected$ } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 }),
      );

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(o => o.selected$),
      map(v => v.map(d => ({
        domain: d.domain,
        software: d.software.map(s => s.software.value)
      }))),
      shareReplay({ refCount: true, bufferSize: 1 }));

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

    return { $, displayWith, trackBy, selected$ } as const;
  }

  private initRoles() {
    const injector = this.injector;

    const obs$ = this.software.selected$
      .pipe(
        map(selected => {
          const exists = this.roles?.$()?.form.getRawValue();

          const mapped = selected.map(d => {

            const softwareLabel = d.software.map(s => s.name).join(' / ') || 'Software';

            const roleMap = new Map<string, SelectableOption<string>>();
            const modules = this.modules.$()
              ?.form.value.find(v => v.domain?.key === d.domain.key)
              ?.modules?.map(m => m.value);
            if (!modules)
              throw new Error('invalid operation');
            modules.forEach(m => m.roles
              .forEach(r => roleMap.set(r, {
                selected: false,
                value: r,
                label: r
              })));

            const roleForms = new FormArray<FormGroup<{
              role: FormControl<SelectableOption<string>>;
              years: FormControl<number>
            }>>([], { validators: [Validators.required, Validators.maxLength(5)] });

            if (exists) {
              const found = exists.find(v => v.domain.key === d.domain.key);
              if (found) {
                found.roles.forEach(v => {
                  const fr = roleMap.get(v.role.value);
                  if (fr) {
                    fr.selected = true;
                    roleForms.push(new FormGroup({
                      role: new FormControl(fr, { nonNullable: true }),
                      years: new FormControl(v.years, {
                        validators: [Validators.required, Validators.min(1), Validators.max(30)],
                        nonNullable: true
                      })
                    }), { emitEvent: false });
                  }
                });
                roleForms.updateValueAndValidity();
              }
            }

            const roles = [...roleMap.values()]
              .sort((a, b) => sortString(a.value, b.value));
            const values = toSignal(controlValue$(roleForms), { requireSync: true, injector });
            const roleLength = computed(() => values().length);
            const totalLength = roles.length;
            const showInput = computed(() => {
              const l = roleLength();
              return l < totalLength && l < 5
            });

            const group = new FormGroup({
              domain: new FormControl(d.domain, { nonNullable: true }),
              roles: roleForms
            });

            const roleFilter$ = signal('');
            const filtered$ = computed(() => {
              const length = roleLength();
              const value = roleFilter$();
              const filter = typeof value === 'string' && value.trim().toLowerCase() || '';
              if (filter || length) {
                return roles.filter(r =>
                  !r.selected &&
                  (!filter || r.value.toLowerCase().includes(filter)));
              }
              return roles;
            });

            const handlers = {
              add: (option: SelectableOption<string>) => {
                option.selected = true;

                roleForms.push(new FormGroup({
                  role: new FormControl(option, { nonNullable: true }),
                  years: new FormControl(null as unknown as number, {
                    validators: [Validators.required, Validators.min(1), Validators.max(30)],
                    nonNullable: true,
                  })
                }), { emitEvent: false });
                roleForms.controls.sort((a, b) => sortString(
                  a.controls.role.value.value,
                  b.controls.role.value.value
                ));
                roleForms.updateValueAndValidity();
              },
              remove: (i: number) => {
                const control = roleForms.at(i);
                control.getRawValue().role.selected = false;
                roleForms.removeAt(i);
              }
            } as const;

            return {
              group,
              options: {
                query$: roleFilter$,
                filtered$,
                ...handlers,
                visible$: showInput
              },
              label: softwareLabel
            } as const;
          });

          const form = new FormArray(mapped.map(m => m.group));
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });
          const options = mapped.map(m => m.options);
          const labels = mapped.map(m => m.label);

          return { form, options, status$, labels } as const;
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
      controls: (_: number, control: Ctrl<Ctrl<Ctrl<FormType>>['roles']>) =>
        control.value.role?.value,
      role: (_: number, option: SelectableOption<string>) => option.value
    } as const;

    return { $, displayWith, trackBy } as const;
  }

  private initTechExp() {
    const data$ = computed(() => {
      const tech = this.domains.tech$();
      const techSize = tech.reduce((p, c) => p + c.tech.length, 0)

      const groupMap = new Map<string, SelectableOption<string>[]>();

      const groups = tech.map(g => {
        const gOpt: SelectableOption<string> = {
          selected: false,
          value: g.name,
          label: g.name
        };
        const tOpts = g.tech.map(t => {
          const opt: SelectableOption<string> = {
            selected: false,
            value: t,
          }
          return opt;
        });

        groupMap.set(g.name, tOpts);

        return gOpt;
      });

      return { groupMap, groups, techSize } as const;
    });

    const groups$ = computed(() => data$().groups);
    const selectedGroup$ = signal<SelectableOption<string> | null>(null);
    const filter$ = signal('');
    const tech$ = computed(() => {
      const g = selectedGroup$();
      const all = g && data$().groupMap.get(g.value) || [];
      const filter = filter$().trim().toLowerCase();
      return filter && all.filter(o => o.value.toLowerCase().includes(filter)) || all;
    });

    type FormType = FormGroup<{
      group: FormControl<string>,
      tech: FormArray<FormGroup<{
        tech: FormControl<SelectableOption<string>>,
        years: FormControl<number>
      }>>
    }>;

    const form = new FormArray<FormType>([]);
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const values = toSignal(controlValue$(form), { requireSync: true });
    const showInput$ = computed(() => {
      const v = values();
      const l = v.reduce((p, c) => p + c.tech.length, 0);
      return l < data$().techSize;
    })

    const handlers = {
      tech: {
        add: (tech: SelectableOption<string>) => {
          if (tech.selected)
            return;
          const group = selectedGroup$()?.value;
          if (!group)
            throw new Error('invalid operation');
          tech.selected = true;
          let groupControl = form.controls.find(c => c.value.group === group);
          if (!groupControl) {
            groupControl = new FormGroup({
              group: new FormControl(group, { nonNullable: true }),
              tech: new FormArray<FormGroup<{
                tech: FormControl<SelectableOption<string>>,
                years: FormControl<number>
              }>>([])
            });
            form.push(groupControl, { emitEvent: false });
            form.controls.sort((a, b) => sortString(
              a.controls.group.value,
              b.controls.group.value));
          }

          const techControls = groupControl.controls.tech;

          techControls.push(new FormGroup({
            tech: new FormControl(tech, { nonNullable: true }),
            years: new FormControl(null as unknown as number, {
              validators: [Validators.required, Validators.min(1), Validators.max(30)],
              nonNullable: true
            })
          }), { emitEvent: false });
          techControls.controls.sort((a, b) => sortString(
            a.controls.tech.value.value,
            b.controls.tech.value.value));
          techControls.updateValueAndValidity();
        },
        remove: (group: number, tech: number) => {
          const groupControl = form.at(group);
          const techControl = groupControl.controls.tech.at(tech);
          techControl.getRawValue().tech.selected = false;
          groupControl.controls.tech.removeAt(tech);
          if (!groupControl.value.tech?.length)
            form.removeAt(group);
        },
      },
      group: {
        select: (option: SelectableOption<string>) => {
          if (option.selected)
            return;
          const current = selectedGroup$();
          if (current)
            current.selected = false;
          option.selected = true;
          selectedGroup$.set(option);
          filter$.set('');
        }
      }
    } as const;

    const selectedSoftware = toSignal(this.software.selected$, { initialValue: [] });
    const softwareLabel$ = computed(() => selectedSoftware()
      .map(s => s.software)
      .flat()
      .map(s => s.name)
      .join(' / '));

    toPromise(groups$, g => g.length > 0)
      .then(groups => handlers.group.select(groups[0]))

    const trackBy = {
      groupControl: (_: number, c: FormType) => c.value.group,
      techControl: (_: number, c: Ctrl<Ctrl<FormType>['tech']>) => c.value.tech?.value,
      stringOption: (_: number, o: SelectableOption<string>) => o.value,
    } as const;

    return {
      form,
      status$,
      softwareLabel$,
      group: {
        all$: groups$,
        selected$: selectedGroup$,
        ...handlers.group
      },
      tech: {
        query$: filter$,
        filtered$: tech$,
        ...handlers.tech
      },
      showInput$,
      trackBy
    } as const;
  }

  private initIndustries() {
    const data$ = computed(() => {
      const industries = this.domains.industries$();
      const industrySize = industries.reduce((p, c) => p + c.industries.length, 0);

      const groupMap = new Map<string, SelectableOption<string>[]>();

      const groups = industries.map(g => {
        const gOpt: SelectableOption<string> = {
          selected: false,
          value: g.name,
          label: g.name
        };

        const tOpts = g.industries.map(i => {
          const opt: SelectableOption<string> = {
            selected: false,
            value: i,
          }
          return opt;
        });

        groupMap.set(g.name, tOpts);

        return gOpt;
      });

      return { groupMap, groups, industrySize };
    });

    const groups$ = computed(() => data$().groups);
    const selectedGroup$ = signal<SelectableOption<string> | null>(null);
    const filter$ = signal('');
    const industries$ = computed(() => {
      const g = selectedGroup$();
      const all = g && data$().groupMap.get(g.value) || [];
      const filter = filter$().trim().toLowerCase();
      return filter && all.filter(o => o.value.toLowerCase().includes(filter)) || all;
    });

    type FormType = FormGroup<{
      group: FormControl<string>,
      industry: FormControl<SelectableOption<string>>,
    }>;

    const form = new FormArray<FormType>([], {
      validators: [Validators.maxLength(5)]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const values = toSignal(controlValue$(form), { requireSync: true });
    const showInput$ = computed(() => {
      const l = values().length;
      return l < data$().industrySize && l < 5;
    });

    const handlers = {
      industry: {
        add: (industry: SelectableOption<string>) => {
          if (industry.selected)
            return;
          const group = selectedGroup$()?.value;
          if (!group)
            throw new Error('invalid operation');
          industry.selected = true;
          form.push(new FormGroup({
            group: new FormControl(group, { nonNullable: true }),
            industry: new FormControl(industry, { nonNullable: true })
          }), { emitEvent: false });
          form.controls.sort((a, b) => sortString(
            `${a.value.group}${a.value.industry?.value}`,
            `${b.value.group}${b.value.industry?.value}`
          ));
          form.updateValueAndValidity();
        },
        remove: (i: number) => {
          const control = form.at(i);
          control.getRawValue().industry.selected = false;
          form.removeAt(i);
        }
      },
      group: {
        select: (option: SelectableOption<string>) => {
          if (option.selected)
            return;
          const current = selectedGroup$();
          if (current)
            current.selected = false;
          option.selected = true;
          selectedGroup$.set(option);
          filter$.set('');
        }
      }
    } as const;

    const selectedDomains = toSignal(this.primaryDomains.selected$, { initialValue: [] });
    const prefixAppLabel$ = computed(() => selectedDomains()
      .map(d => `${d.prefix && `${d.prefix} - ` || ''}${d.longName}`)
      .join(' / '))

    toPromise(groups$, g => g.length > 0)
      .then(groups => handlers.group.select(groups[0]));

    const trackBy = {
      control: (_: number, c: FormType) => `${c.value.group}/${c.value.industry}`,
      stringOption: (_: number, o: SelectableOption<string>) => o.value
    } as const;

    return {
      form,
      status$,
      prefixAppLabel$,
      group: {
        all$: groups$,
        selected$: selectedGroup$,
        ...handlers.group
      },
      industry: {
        query$: filter$,
        filtered$: industries$,
        ...handlers.industry
      },
      showInput$,
      trackBy
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

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options, form } = this.roles.$()!;

      const [s0o0, s0o1] = options[0].filtered$();
      options[0].add(s0o0);
      options[0].add(s0o1);

      const [s1o0, s1o1] = options[1].filtered$();
      options[1].add(s1o0);
      options[1].add(s1o1);

      form.at(0).controls.roles.at(0).controls.years.setValue(2);
      form.at(0).controls.roles.at(1).controls.years.setValue(2);
      form.at(1).controls.roles.at(0).controls.years.setValue(2);
      form.at(1).controls.roles.at(1).controls.years.setValue(2);

      this.stepper.next.click();
    }

    {
      const form = this.techExp.form;
      const select = this.techExp.group.select
      const add = this.techExp.tech.add;
      const groups = this.techExp.group.all$();
      for (let gi = 0; gi < 3; gi++) {
        const g = groups[gi];
        select(g);
        const tech = this.techExp.tech.filtered$();
        for (let ti = 0; ti < 3; ti++) {
          add(tech[ti]);
          form.at(gi).controls.tech.at(ti).controls.years.setValue(gi + ti + 1);
        }
      }
      select(groups[0]);

      this.stepper.next.click();
    }

    {
      const select = this.industries.group.select;
      const add = this.industries.industry.add;
      const groups = this.industries.group.all$();
      for (let gi = 0; gi < 5; gi++) {
        const g = groups[gi];
        select(g);
        const ind = this.industries.industry.filtered$();
        add(ind[0]);
      }
      select(groups[0]);

      this.stepper.next.click();
    }

    revert.forEach(r => r());
  }

  private async getData() {
    this.loading.add('getting data');
    const toDo = [] as Promise<unknown>[];

    if (!this.section || this.section === 'technology-stack') {
      this.domains.getTech();
    }

    if (!this.section || this.section === 'industry') {
      this.domains.getIndustries();
    }

    toDo.push(toPromise(this.domains.loading.any$, v => !v));

    await Promise.all(toDo);
    this.loading.delete('getting data');
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