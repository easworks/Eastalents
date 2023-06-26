import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, Signal, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { LocationApi } from '@easworks/app-shell/api/location';
import { Domain, DomainModule, DomainProduct } from '@easworks/app-shell/api/talent.api';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { GeoLocationService } from '@easworks/app-shell/services/geolocation';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { sleep } from '@easworks/app-shell/utilities/sleep';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { FreelancerProfile, OVERALL_EXPERIENCE_OPTIONS } from '@easworks/models';
import { City, Country, State } from 'country-state-city';
import { ICity, ICountry, IState, Timezones } from 'country-state-city/lib/interface';
import { map, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'freelancer-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImportsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
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

  protected readonly trackBy = {
    country: (_: number, c: ICountry) => c.isoCode,
    state: (_: number, s: IState) => s.isoCode,
    domain: (_: number, d: Domain) => d.key,
    domainOption: (_: number, d: SelectableOption<Domain>) => d.value.key,
    moduleOption: (_: number, m: SelectableOption<DomainModule>) => m.value.name,
    softwareOption: (_: number, s: SelectableOption<DomainProduct>) => s.value.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
    name: (_: number, i: { name: string }) => i.name
  } as const;

  protected readonly displayWith = {
    country: (c?: ICountry) => c?.name || '',
    state: (s?: IState) => s?.name || '',
    city: (c?: ICity) => c?.name || '',
    timezone: (t?: Timezones) => t?.zoneName || '',
    none: () => ''
  } as const;

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
      showFlag$: computed(() => {
        const v = values.country();
        return !!v && typeof v !== 'string';
      }),
      summaryWords$
    } as const;
  }

  private initPrimaryDomains() {
    const domains$ = computed(() => {
      const optionMap = new Map<string, SelectableOption<Domain>>();
      const options = this.domains.domains$().map(d => {
        const opt: SelectableOption<Domain> = {
          selected: false,
          value: d,
          label: d.longName,
        };
        optionMap.set(d.key, opt);
        return opt;
      });
      return { options, map: optionMap } as const;
    });
    const map$ = computed(() => domains$().map);
    const options$ = computed(() => domains$().options);

    const size$ = signal(0);
    const stopInput$ = computed(() => size$() >= 3);

    const form = new FormRecord<FormControl<number>>({}, {
      validators: [
        c => {
          const size = Object.keys(c.value).length;
          size$.set(size);
          if (size < 1)
            return { minlength: 1 }
          if (size > 3)
            return { maxlength: 3 }
          return null;
        }
      ]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const selected$ = controlValue$(form, true)
      .pipe(
        map(v => {
          const map = map$();
          return Object.keys(v)
            .sort(sortString)
            .map(k => {
              const o = map.get(k);
              if (!o)
                throw new Error('invalid operation');
              return o.value;
            });
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const handlers = {
      toggle: (option: SelectableOption<Domain>) => {
        if (option.selected) {
          option.selected = false;
          form.removeControl(option.value.key);
        }
        else {
          option.selected = true;
          form.addControl(option.value.key, createYearControl())
        }
      }
    } as const;


    return {
      form,
      status$,
      selected$,
      stopInput$,
      size$,
      options$,
      ...handlers
    } as const;
  }

  private initServices() {
    const injector = this.injector;

    const stepLabel$ = toSignal(this.primaryDomains.selected$
      .pipe(map(selected => (selected.length === 1 && selected[0].longName) || 'Enterprise Application')),
      { initialValue: 'Enterprise Application' });

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(domains => {
          const exists = this.services?.$()?.form.getRawValue();

          const form = new FormRecord<FormRecord<FormControl<number>>>({});
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const options: Record<string, {
            all: SelectableOption<string>[],
            size$: Signal<number>,
            toggle: (option: SelectableOption<string>) => void
          }> = {};

          const optionMap = new Map<string, SelectableOption<string>>();
          domains.forEach(d => {
            const size$ = signal(0);
            const serviceForm = new FormRecord<FormControl<number>>({}, {
              validators: [
                c => {
                  const size = Object.keys(c.value).length;
                  size$.set(size);
                  if (size < 1)
                    return { minlength: 1 }
                  return null;
                }
              ]
            });

            const all = d.services.map(s => {
              const opt: SelectableOption<string> = {
                selected: false,
                value: s,
                label: s
              };
              optionMap.set(`${d.key}/${s}`, opt);
              return opt;
            });

            form.addControl(d.key, serviceForm, { emitEvent: false });

            options[d.key] = {
              all,
              toggle: (option) => {
                if (option.selected) {
                  option.selected = false;
                  serviceForm.removeControl(option.value);
                }
                else {
                  option.selected = true;
                  serviceForm.addControl(option.value, createYearControl());
                }
              },
              size$
            }
          });

          if (exists) {
            Object.keys(exists).forEach(domain => {
              const serviceForm = form.controls[domain];
              if (serviceForm) {
                Object.keys(exists[domain]).forEach(service => {
                  const option = optionMap.get(`${domain}/${service}`);
                  if (!option)
                    throw new Error('invalid operation');
                  option.selected = true;
                  serviceForm.addControl(service, createYearControl(exists[domain][service]), { emitEvent: false });
                })
              }
            })
          }

          form.updateValueAndValidity();

          return { form, status$, options, domains } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);

    return { $, stepLabel$ } as const;
  }

  private initModules() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(domains => {
          const exists = this.modules?.$()?.form.getRawValue();

          const form = new FormRecord<FormControl<Set<DomainModule>>>({});
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const options: Record<string, {
            all: SelectableOption<DomainModule>[],
            toggle: (option: SelectableOption<DomainModule>) => void,
            stopInput$: Signal<boolean>,
            size$: Signal<number>,
            selectAll: {
              visible: boolean,
              value: boolean,
              toggle: () => void
            }
          }> = {};

          const optionMap = new Map<string, SelectableOption<DomainModule>>();
          domains.forEach(d => {
            const size$ = signal(0);
            const stopInput$ = computed(() => size$() >= 7);

            const moduleForm = new FormControl<Set<DomainModule>>(new Set(), {
              validators: [
                c => {
                  const v = c.value as Set<string>;
                  size$.set(v.size);
                  if (v.size < 1)
                    return { minlength: 1 };
                  if (v.size > 7)
                    return { maxlength: 7 };
                  return null;
                }
              ],
              nonNullable: true
            });

            const all = d.modules.map(m => {
              const opt: SelectableOption<DomainModule> = {
                selected: false,
                value: m,
                label: m.name
              };
              optionMap.set(`${d.key}/${m.name}`, opt);
              return opt;
            });

            form.addControl(d.key, moduleForm, { emitEvent: false });

            options[d.key] = {
              all,
              size$,
              stopInput$,
              toggle: (option) => {
                const v = moduleForm.getRawValue()
                if (option.selected) {
                  option.selected = false;
                  v.delete(option.value);
                }
                else {
                  option.selected = true;
                  v.add(option.value);
                }
                moduleForm.setValue(v);
                options[d.key].selectAll.value = v.size === all.length;
              },
              selectAll: {
                visible: all.length > 1 && all.length <= 7,
                value: false,
                toggle: () => {
                  const v = moduleForm.getRawValue();
                  const selected = !options[d.key].selectAll.value;
                  if (selected) {
                    all.forEach(o => {
                      o.selected = true;
                      v.add(o.value);
                    });
                  }
                  else {
                    all.forEach(o => {
                      o.selected = false;
                      v.clear();
                    });
                  }
                  moduleForm.setValue(v);
                  options[d.key].selectAll.value = selected;
                }
              }
            }
          });

          if (exists) {
            Object.keys(exists).forEach(domain => {
              const moduleForm = form.controls[domain];
              if (moduleForm) {
                exists[domain].forEach(module => {
                  const option = optionMap.get(`${domain}/${module.name}`);
                  if (!option)
                    throw new Error('invalid operation');
                  option.selected = true;
                  moduleForm.value.add(module);
                });
                moduleForm.updateValueAndValidity({ onlySelf: true })
                options[domain].selectAll.value = moduleForm.value.size === options[domain].all.length;
              }
            });
          }

          form.updateValueAndValidity();

          const selected$ = controlValue$(form, true)
            .pipe(
              map(v => domains.map(d => ({
                domain: d,
                modules: [...v[d.key]]
              }))
              ),
              shareReplay({ refCount: true, bufferSize: 1 })
            );

          return { form, status$, options, domains, selected$ } as const;

        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(o => o.selected$),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    return { $, stepLabel$, selected$ } as const;
  }

  private initSoftware() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = this.modules.selected$
      .pipe(
        map(selected => {
          const exists = this.software?.$()?.form.getRawValue();

          const form = new FormRecord<FormRecord<FormControl<number>>>({});
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const options: Record<string, {
            all: SelectableOption<DomainProduct>[],
            size$: Signal<number>,
            stopInput$: Signal<boolean>,
            toggle: (option: SelectableOption<DomainProduct>) => void,
            record: Record<string, SelectableOption<DomainProduct>>
          }> = {};

          selected.forEach(s => {
            const size$ = signal(0);
            const stopInput$ = computed(() => size$() >= 5);

            const softwareForm = new FormRecord<FormControl<number>>({}, {
              validators: [
                c => {
                  const size = Object.keys(c.value).length;
                  size$.set(size);
                  if (size < 1)
                    return { minlength: 1 };
                  if (size > 5)
                    return { maxlength: 5 };
                  return null;
                }
              ]
            });

            const record: Record<string, SelectableOption<DomainProduct>> = {};
            s.modules.forEach(m => {
              m.products.forEach(p => {
                const opt: SelectableOption<DomainProduct> = {
                  selected: false,
                  value: p,
                  label: p.name
                };
                record[p.name] = opt;
              });
            });

            const all = Object.values(record)
              .sort((a, b) => sortString(a.value.name, b.value.name));

            form.addControl(s.domain.key, softwareForm, { emitEvent: false });

            options[s.domain.key] = {
              all,
              size$,
              stopInput$,
              toggle: (option) => {
                if (option.selected) {
                  option.selected = false;
                  softwareForm.removeControl(option.value.name);
                }
                else {
                  option.selected = true;
                  softwareForm.addControl(option.value.name, createYearControl());
                }
              },
              record
            };
          });

          if (exists) {
            Object.keys(exists).forEach(domain => {
              const softwareForm = form.controls[domain];
              if (softwareForm) {
                Object.keys(exists[domain]).forEach(software => {
                  const option = options[domain].record[software];
                  option.selected = true;
                  softwareForm.addControl(software, createYearControl(exists[domain][software]), { emitEvent: false });
                });
              }
            });
          }

          form.updateValueAndValidity();

          const selected$ = controlValue$(form, true)
            .pipe(
              map((v) => selected.map(s => {
                const domain = s.domain;
                const modules = s.modules;
                const software = Object.keys(v[domain.key])
                  .map(s => options[domain.key].record[s].value)
                return { domain, modules, software };
              })
              ),
              shareReplay({ refCount: true, bufferSize: 1 })
            );

          const domains = selected.map(s => s.domain);

          return { form, status$, domains, options, selected$ } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(f => f.selected$),
      shareReplay({ refCount: true, bufferSize: 1 })
    )

    return { $, stepLabel$, selected$ } as const;

  }

  private initRoles() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = this.software.selected$
      .pipe(
        map(selected => {
          const exists = this.roles?.$()?.form.getRawValue();

          const form = new FormRecord<FormRecord<FormControl<number>>>({});
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const options: Record<string, {
            list: SelectableOption<string>[],
            record: Record<string, SelectableOption<string>>
            size$: Signal<number>,
            stopInput$: Signal<boolean>,
            toggle: (option: SelectableOption<string>) => void,
          }> = {};

          selected.forEach(s => {

            const size$ = signal(0);
            const stopInput$ = computed(() => size$() >= 5);

            const roleForm = new FormRecord<FormControl<number>>({}, {
              validators: [
                c => {
                  const size = Object.keys(c.value).length;
                  size$.set(size);
                  if (size < 1)
                    return { minlength: 1 };
                  if (size > 5)
                    return { maxlength: 5 };
                  return null;
                }
              ]
            });

            const record: Record<string, SelectableOption<string>> = {};
            s.modules.forEach(m => {
              m.roles.forEach(r => {
                const opt: SelectableOption<string> = {
                  selected: false,
                  value: r,
                  label: r
                };
                record[r] = opt;
              });
            });

            const list = Object.values(record)
              .sort((a, b) => sortString(a.value, b.value));

            form.addControl(s.domain.key, roleForm, { emitEvent: false });

            options[s.domain.key] = {
              list,
              size$,
              stopInput$,
              toggle: (option) => {
                if (option.selected) {
                  option.selected = false;
                  roleForm.removeControl(option.value);
                }
                else {
                  option.selected = true;
                  roleForm.addControl(option.value, createYearControl());
                }
              },
              record
            }
          });

          if (exists) {
            Object.keys(exists).forEach(domain => {
              const roleForm = form.controls[domain];
              if (roleForm) {
                Object.keys(exists[domain]).forEach(role => {
                  const option = options[domain].record[role];
                  option.selected = true;
                  roleForm.addControl(role, createYearControl(exists[domain][role]), { emitEvent: false });
                });
              }
            });
          }

          form.updateValueAndValidity();

          const domains = selected.map(s => s.domain);

          return { form, status$, options, domains } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);

    return { $, stepLabel$ } as const;
  }

  private initTechExp() {
    const stepLabel$ = this.services.stepLabel$;

    const form = new FormRecord<FormControl<Set<SelectableOption<string>>>>({});
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const size$ = computed(() => Object.values(value$()).reduce((p, c) => p + c.size, 0));
    const skippable$ = computed(() => size$() === 0);
    const fullSize$ = computed(() => this.domains.tech$().reduce((p, c) => p + c.items.size, 0));
    const stopInput$ = computed(() => size$() >= fullSize$());

    const query$ = signal<string | object>('');

    type OptionGroup = {
      name: string;
      tech: SelectableOption<string>[];
    };
    const all$ = computed(() => this.domains.tech$()
      .map<OptionGroup>(g => ({
        name: g.name,
        tech: [...g.items]
          .map(t => ({
            selected: false,
            value: t,
            label: t
          }))
      })));


    const filtered$ = computed(() => {
      const q = query$();
      const all = all$();

      const filter = typeof q === 'string' && q.trim().toLowerCase();

      const filtered = all
        .map(g => {
          const matchGroup = filter && g.name.toLowerCase().includes(filter);
          if (matchGroup)
            return {
              name: g.name,
              tech: g.tech.filter(t => !t.selected)
            };
          return {
            name: g.name,
            tech: g.tech
              .filter(t => !t.selected && (!filter || t.value.toLowerCase().includes(filter)))
          };
        })
        .filter(g => g.tech.length);
      return filtered;
    });

    const handlers = {
      add: (group: string, option: SelectableOption<string>) => {
        option.selected = true;
        let control = form.controls[group];
        if (!control) {
          control = new FormControl(new Set<SelectableOption<string>>(), { nonNullable: true });
          form.addControl(group, control);
        }
        control.value.add(option);
        control.updateValueAndValidity();
        query$.mutate(v => v);
      },
      remove: (group: string, option: SelectableOption<string>) => {
        option.selected = false;
        const control = form.controls[group];
        if (!control)
          throw new Error('invalid operation');
        control.value.delete(option);
        if (control.value.size)
          control.updateValueAndValidity();
        else
          form.removeControl(group);
        query$.mutate(v => v);
      },
      skip: () => {
        Object.keys(form.controls).forEach(k => form.removeControl(k, { emitEvent: false }));
        form.updateValueAndValidity();
        this.stepper.next.click();
      }
    } as const;

    form.updateValueAndValidity();

    return {
      form,
      value$,
      status$,
      query$,
      filtered$,
      stepLabel$,
      size$,
      stopInput$,
      skippable$,
      ...handlers
    } as const;
  }

  private initIndustries() {
    const stepLabel$ = this.services.stepLabel$;

    const form = new FormRecord<FormControl<Set<SelectableOption<string>>>>({});
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const size$ = signal(0);
    const stopInput$ = computed(() => size$() >= 5);

    form.addValidators((c) => {
      const v = c.value as Record<string, Set<SelectableOption<string>>>;
      const size = Object.values(v)
        .reduce((p, c) => p + c.size, 0);
      size$.set(size);
      if (size === 0)
        return { minlength: 1 };
      if (size > 5)
        return { maxlength: 5 };
      return null;
    });

    const query$ = signal<string | object>('');

    type OptionGroup = {
      name: string;
      industries: SelectableOption<string>[];
    };


    const all$ = computed(() => this.domains.industries$()
      .map<OptionGroup>(g => ({
        name: g.name,
        industries: g.industries
          .map(i => ({
            selected: false,
            value: i,
            label: i
          }))
      })));


    const filtered$ = computed(() => {
      const q = query$();
      const all = all$();

      const filter = typeof q === 'string' && q.trim().toLowerCase();

      const filtered = all
        .map(g => {
          const matchGroup = filter && g.name.toLowerCase().includes(filter);
          if (matchGroup)
            return {
              name: g.name,
              industries: g.industries.filter(i => !i.selected)
            };
          return {
            name: g.name,
            industries: g.industries
              .filter(i => !i.selected && (!filter || i.value.toLowerCase().includes(filter)))
          };
        })
        .filter(g => g.industries.length);
      return filtered;
    });

    const handlers = {
      add: (group: string, option: SelectableOption<string>) => {
        option.selected = true;
        let control = form.controls[group];
        if (!control) {
          control = new FormControl(new Set<SelectableOption<string>>(), { nonNullable: true });
          form.addControl(group, control);
        }
        control.value.add(option);
        control.updateValueAndValidity();
        query$.mutate(v => v);
      },
      remove: (group: string, option: SelectableOption<string>) => {
        option.selected = false;
        const control = form.controls[group];
        if (!control)
          throw new Error('invalid operation');
        control.value.delete(option);
        if (control.value.size)
          control.updateValueAndValidity();
        else
          form.removeControl(group);
        query$.mutate(v => v);
      }
    } as const;

    form.updateValueAndValidity();

    return {
      form,
      value$,
      status$,
      query$,
      filtered$,
      stepLabel$,
      size$,
      stopInput$,
      ...handlers
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
        this.primaryDomains.options$,
        all => all.length > 0,
        injector
      );

      this.primaryDomains.toggle(all[0]);
      this.primaryDomains.toggle(all[1]);
      this.primaryDomains.form.get(all[0].value.key)?.setValue(2);
      this.primaryDomains.form.get(all[1].value.key)?.setValue(2);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { form, options, domains } = this.services.$()!;

      domains.forEach(d => {
        const all = options[d.key].all;
        options[d.key].toggle(all[0]);
        options[d.key].toggle(all[1]);

        form.controls[d.key].controls[all[0].value].setValue(2);
        form.controls[d.key].controls[all[1].value].setValue(3);
      });

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options, domains } = this.modules.$()!;

      domains.forEach(d => {
        const all = options[d.key].all;

        options[d.key].toggle(all[0]);
        options[d.key].toggle(all[1]);
      });

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { form, options, domains } = this.software.$()!;

      domains.forEach(d => {
        const all = options[d.key].all;

        options[d.key].toggle(all[0]);
        options[d.key].toggle(all[1]);

        form.controls[d.key].controls[all[0].value.name].setValue(2);
        form.controls[d.key].controls[all[1].value.name].setValue(3);
      })

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { form, options, domains } = this.roles.$()!;

      domains.forEach(d => {
        const { list, toggle } = options[d.key];

        toggle(list[0]);
        toggle(list[1]);

        form.controls[d.key].controls[list[0].value].setValue(2);
        form.controls[d.key].controls[list[1].value].setValue(3);
      });

      this.stepper.next.click();
    }

    {
      this.stepper.next.click();
    }

    {
      const { filtered$, add } = this.industries;
      const f = filtered$();

      add(f[0].name, f[0].industries[0]);
      add(f[0].name, f[0].industries[1]);
      add(f[0].name, f[0].industries[2]);
      add(f[1].name, f[1].industries[0]);

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

function createYearControl(initialValue = null as unknown as number) {
  return new FormControl(
    initialValue,
    {
      validators: [Validators.required, Validators.min(1), Validators.max(30)],
      nonNullable: true
    }
  );
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