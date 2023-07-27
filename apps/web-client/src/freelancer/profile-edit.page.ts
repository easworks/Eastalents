import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, Signal, WritableSignal, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { CSCApi, City, Country, State, Timezone } from '@easworks/app-shell/api/csc';
import { GMapsApi } from '@easworks/app-shell/api/gmap';
import { LocationApi } from '@easworks/app-shell/api/location';
import { Domain, DomainModule, DomainProduct } from '@easworks/app-shell/api/talent.api';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { GeoLocationService } from '@easworks/app-shell/services/geolocation';
import { AuthState } from '@easworks/app-shell/state/auth';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { COMMITMENT_OPTIONS, Commitment, ENGLISH_PROFICIENCY_OPTIONS, EnglishProficiency, FREELANCER_AVAILABILITY_OPTIONS, FreelancerAvailability, JOB_SEARCH_STATUS_OPTIONS, JobSearchStatus, LatLng, OVERALL_EXPERIENCE_OPTIONS, OverallExperience, pattern } from '@easworks/models';
import { DateTime, IANAZone } from 'luxon';
import { map, shareReplay, switchMap } from 'rxjs';
import { DropDownIndicatorComponent } from '@easworks/app-shell/common/drop-down-indicator';

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
    MatPseudoCheckboxModule,
    DropDownIndicatorComponent
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
    gmap: inject(GMapsApi),
    csc: inject(CSCApi)
  } as const;
  private readonly domains = inject(DomainState);
  private readonly user = inject(AuthState).user$;

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  private readonly loading = generateLoadingState<[
    'getting profile data',
    'getting geolocation',
    'getting data',
    'ps-country',
    'ps-state',
    'ps-city',
    'ps-timezone',
    'pd-country',
    'pd-state',
    'pd-city',
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  protected readonly loadingData$ = this.loading.has('getting data');
  private readonly section = this.initSection();
  private readonly allCountries = this.api.csc.allCountries();

  protected readonly professionalSummary = this.initProfessionaSummary();
  protected readonly primaryDomains = this.initPrimaryDomains();
  protected readonly services = this.initServices();
  protected readonly modules = this.initModules();
  protected readonly software = this.initSoftware();
  protected readonly roles = this.initRoles();
  protected readonly techExp = this.initTechExp();
  protected readonly industries = this.initIndustries();
  protected readonly jobCommittment = this.initJobCommitment();
  protected readonly rateExpectation = this.initRateExpectation();
  protected readonly preferredRoles = this.initPreferredRoles();
  protected readonly preferredWorkingHours = this.initPreferredWorkingHours();
  protected readonly jobSearchStatus = this.initJobSearchStatus();
  protected readonly availability = this.initAvailability();
  protected readonly profileDetails = this.initProfileDetails();

  protected readonly stepper = this.initStepper();
  protected readonly stepperGroups = this.initStepperGroups();

  protected readonly trackBy = {
    country: (_: number, c: Country) => c.iso2,
    state: (_: number, s: State) => s.iso2,
    domain: (_: number, d: Domain) => d.key,
    domainOption: (_: number, d: SelectableOption<Domain>) => d.value.key,
    moduleOption: (_: number, m: SelectableOption<DomainModule>) => m.value.name,
    softwareOption: (_: number, s: SelectableOption<DomainProduct>) => s.value.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
    name: (_: number, i: { name: string }) => i.name,
    key: (_: number, kv: KeyValue<string, unknown>) => kv.key
  } as const;

  protected readonly displayWith = {
    country: (c?: Country) => c?.name || '',
    state: (s?: State) => s?.name || '',
    city: (c?: City) => c?.name || '',
    timezone: (t?: Timezone) => t?.zoneName || '',
    currency: (c?: Country) => c ? `${c.currency} (${c.name})` : '',
    phoneCode: (c?: Country) => c ? c.phonecode : '',
    none: () => '',
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  private initStepper() {
    const step$ = signal<Step>(this.section ?? 'start');

    const order: Step[] = [
      'start',
      'professional-summary',
      'primary-domains',
      'services',
      'modules',
      'software',
      'roles',
      'technology-stack',
      'industry',
      'job-commitment',
      'rate-expectation',
      'preferred-roles',
      'preferred-working-hours',
      'job-search-status',
      'availability',
      'profile-details',
      'end'
    ];

    const stepNumbers = order.reduce((prev, cv, ci) => {
      prev[cv] = ci;
      return prev;
    }, {} as Record<Step, number>);

    const totalSteps = order.length - 2;

    const stepIndex$ = computed(() => stepNumbers[step$()]);
    const progress$ = computed(() => {
      const s = stepIndex$();
      return {
        label: `Step ${s} of ${totalSteps}`,
        percent: ((s - 1) / totalSteps) * 100
      }
    });

    const showStepControls$ = computed(() => {
      if (this.section)
        return false;

      const step = step$();
      return step !== 'start' && step !== 'end';
    });

    const firstStep = order[1];
    const lastStep = order.at(-2);

    const isValidStep = (step: Step) =>
      (step === 'professional-summary' && this.professionalSummary.status$() === 'VALID') ||
      (step === 'primary-domains' && this.primaryDomains.status$() === 'VALID') ||
      (step === 'services' && this.services.$()?.status$() === 'VALID') ||
      (step === 'modules' && this.modules.$()?.status$() === 'VALID') ||
      (step === 'software' && this.software.$()?.status$() === 'VALID') ||
      (step === 'roles' && this.roles.$()?.status$() === 'VALID') ||
      (step === 'technology-stack' && this.techExp.status$() === 'VALID') ||
      (step === 'industry' && this.industries.status$() === 'VALID') ||
      (step === 'job-commitment' && this.jobCommittment.status$() === 'VALID') ||
      (step === 'rate-expectation' && this.rateExpectation.status$() === 'VALID') ||
      (step === 'preferred-roles' && this.preferredRoles.$()?.status$() === 'VALID') ||
      (step === 'preferred-working-hours' && this.preferredWorkingHours.status$() === 'VALID') ||
      (step === 'job-search-status' && this.jobSearchStatus.status$() === 'VALID') ||
      (step === 'availability' && this.availability.status$() === 'VALID') ||
      (step === 'profile-details' && this.profileDetails.status$() === 'VALID');

    const next = {
      visible$: computed(() => step$() !== lastStep),
      disabled$: computed(() => this.loading.any$() || !isValidStep(step$())),
      click: () => {
        const current = stepIndex$();
        step$.set(order[current + 1]);
        document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
      },

    } as const;

    const prev = {
      visible$: computed(() => step$() !== firstStep),
      click: () => {
        const current = stepIndex$();
        step$.set(order[current - 1]);
        document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
      }
    } as const;

    const submit = {
      disabled$: next.disabled$,
      visible$: computed(() => step$() === lastStep),
      click: () => {
        // 
      }
    } as const;

    return {
      totalSteps,
      step$,
      stepIndex$,
      showStepControls$,
      progress$,
      isValidStep,
      next,
      prev,
      submit
    } as const;
  }

  private initStepperGroups() {
    type StepGroupID =
      'Professional Experience' |
      'Work Preference' |
      'Profile Setup';

    type StepGroup = {
      label: StepGroupID;
      enabled$: Signal<boolean>,
      completed$: Signal<boolean>,
      click: () => void
    }

    const groupings: [StepGroupID, Step[]][] = [
      [
        'Professional Experience',
        [
          'professional-summary',
          'primary-domains',
          'services',
          'modules',
          'software',
          'roles',
          'technology-stack',
          'industry'
        ]
      ],
      [
        'Work Preference',
        [
          'job-commitment',
          'rate-expectation',
          'preferred-roles',
          'preferred-working-hours',
          'job-search-status',
          'availability'
        ]
      ],
      [
        'Profile Setup',
        ['profile-details']
      ]
    ];

    const isValidStep = this.stepper.isValidStep;
    const groupSteps = groupings
      .map<StepGroup>(([label, steps]) => ({
        label,
        enabled$: computed(() => true),
        completed$: computed(() => steps.every(step => isValidStep(step))),
        click: () => this.stepper.step$.set(steps[0])
      }));

    groupSteps.forEach((step, i) => {
      if (i > 0)
        step.enabled$ = computed(() => {
          const prev = groupSteps[i - 1];
          return prev.completed$() && prev.enabled$();
        });
      // const completed = step.completed$;
      // step.completed$ = computed(() => step.enabled$() && completed());
    });

    return groupSteps;
  }

  private initSection() {
    if (this.isNew)
      return null;

    const param = this.route.snapshot.queryParamMap.get('section');
    const allowed: Step[] = [];

    return allowed.find(i => i === param) ?? null;
  }

  private initProfessionaSummary() {

    const form = new FormGroup({
      summary: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(1500),
        ],
        nonNullable: true
      }),
      experience: new FormControl(null as unknown as OverallExperience, {
        validators: [Validators.required],
        nonNullable: true
      }),
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

    const allOptions = {
      country$: signal<Country[]>([]),
      state$: signal<State[]>([]),
      city$: signal<City[]>([]),
      timezone$: signal<Timezone[]>([]),
    };

    const filteredOptions = {
      experience: OVERALL_EXPERIENCE_OPTIONS,
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
    }

    const validation = {
      stateRequired$: computed(() => allOptions.state$().length > 0),
      cityRequired$: computed(() => allOptions.city$().length > 0)
    }

    const loading = {
      geo$: this.loading.has('getting geolocation'),
      country$: this.loading.has('ps-country'),
      state$: this.loading.has('ps-state'),
      city$: this.loading.has('ps-city'),
      timezone$: this.loading.has('ps-timezone'),
    } as const;

    const disabled = {
      country$: computed(() => loading.geo$() || loading.country$()),
      state$: computed(() => loading.geo$() || loading.state$() || status.country() !== 'VALID'),
      city$: computed(() => loading.geo$() || loading.city$() || status.country() !== 'VALID'),
      timezone$: computed(() => loading.geo$() || loading.timezone$() || status.country() !== 'VALID' || allOptions.timezone$().length === 0),
    } as const;

    effect(() => disabled.country$() ? form.controls.country.disable() : form.controls.country.enable(), { allowSignalWrites: true });
    effect(() => disabled.state$() ? form.controls.state.disable() : form.controls.state.enable(), { allowSignalWrites: true });
    effect(() => disabled.city$() ? form.controls.city.disable() : form.controls.city.enable(), { allowSignalWrites: true });
    effect(() => disabled.timezone$() ? form.controls.timezone.disable() : form.controls.timezone.enable(), { allowSignalWrites: true });

    // dynamically add/remove validators for the state and city controls
    {
      form.controls
      // eslint-disable-next-line no-inner-declarations
      function dynamicallyRequired(
        isRequired: Signal<boolean>,
        control: FormControl<string>
      ) {
        effect(() => {
          if (isRequired()) {
            control.addValidators(Validators.required);
          }
          else {
            control.removeValidators(Validators.required);
          }
          control.updateValueAndValidity();
        }, { allowSignalWrites: true })

      }

      dynamicallyRequired(validation.stateRequired$, form.controls.state);
      dynamicallyRequired(validation.cityRequired$, form.controls.city);
    }

    // react to changes in the country control
    effect(async () => {
      const options = filteredOptions.country$();
      const country = values.country();
      form.controls.state.reset();
      form.controls.city.reset();
      form.controls.timezone.reset();

      allOptions.state$.set([]);
      allOptions.city$.set([]);
      allOptions.timezone$.set([]);

      if (options.length < 25) {
        const match = options.find(o => o.name.toLowerCase() === country.trim().toLowerCase());
        if (match) {
          // populate the options for timezone
          {
            this.loading.add('ps-timezone');
            const cscTz = match.timezones;
            if (cscTz.length)
              allOptions.timezone$.set(cscTz);
            else {
              const all = await this.api.csc.allTimezones();
              allOptions.timezone$.set(all)
            }
            this.loading.delete('ps-timezone');
          }

          // populate the options for state
          this.loading.add('ps-state');
          if (match.name.length === country.length) {
            if (match.name !== country) {
              form.controls.country.setValue(match.name);
            }
            else {
              const states = await this.api.csc.allStates(match.iso2);
              if (states.length) {
                states.sort((a, b) => sortString(a.name, b.name));
                allOptions.state$.set(states);
              }
              // populate the options for cities when no states were found
              else {
                this.loading.add('ps-city');
                const cities = await this.api.csc.allCities(match.iso2);
                cities.sort((a, b) => sortString(a.name, b.name));
                allOptions.city$.set(cities);
                this.loading.delete('ps-city');
              }
            }
          }
          this.loading.delete('ps-state');
        }
      }
    }, { allowSignalWrites: true });

    effect(async () => {
      const options = filteredOptions.state$();
      const state = values.state();
      form.controls.city.reset();
      allOptions.city$.set([]);

      if (options.length < 25) {
        const match = options.find(o => o.name.toLowerCase() === state.trim().toLowerCase());
        if (match && match.name.length === state.length) {
          if (match.name !== state) {
            form.controls.state.setValue(match.name);
          }
          else {
            // populate the options for cities
            this.loading.add('ps-city');
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
            this.loading.delete('ps-city');
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
          form.controls.city.setValue(match.name);
        }
      }
    }, { allowSignalWrites: true })

    effect(() => {
      const options = allOptions.timezone$();
      if (options.length === 1) {
        form.controls.timezone.setValue(options[0].zoneName);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const options = filteredOptions.timezone$();
      if (options.length < 25) {
        const tz = values.timezone();
        const match = options.find(o => o.zoneName.toLowerCase() === tz.trim().toLowerCase());
        if (match && match.zoneName.length === tz.length && match.zoneName !== tz) {
          form.controls.timezone.setValue(match.zoneName);
        }
      }
    }, { allowSignalWrites: true });

    // populate the country list
    // pre-fill the current location
    {
      this.loading.add('ps-country');
      this.allCountries
        .then(async countries => {
          allOptions.country$.set([...countries].sort((a, b) => sortString(a.name, b.name)));
          this.loading.delete('ps-country');


          if (this.isNew) {
            const cl = await this.getCurrentLocation();
            if (cl) {
              form.controls.country.setValue(cl.country?.long_name || '');

              await toPromise(loading.state$, v => v, this.injector);
              await toPromise(loading.state$, v => !v, this.injector);
              form.controls.state.setValue(cl.state?.long_name || '');

              await toPromise(loading.city$, v => v, this.injector);
              await toPromise(loading.city$, v => !v, this.injector);
              form.controls.city.setValue(cl.city?.long_name || '');
            }
          }
        });
    }

    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    return {
      form,
      status$,
      loading,
      options: filteredOptions,
      validation
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

          const value$ = toSignal(controlValue$(form, true), { injector });
          const selected$ = computed(() => {
            const v = value$() || {};
            return Object.keys(v)
              .reduce((prev, current) => {
                prev[current] = Object.keys(v[current]);
                return prev;
              }, {} as { [key: string]: string[] });
          })

          return { form, status$, options, domains, selected$ } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);

    return { $, stepLabel$ } as const;
  }

  private initTechExp() {
    const stepLabel$ = this.services.stepLabel$;

    const form = new FormRecord<FormControl<SelectableOption<string>[]>>({});
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const size$ = computed(() => Object.values(value$()).reduce((p, c) => p + c.length, 0));
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
          control = new FormControl([], { nonNullable: true });
          form.addControl(group, control);
        }
        control.value.push(option);
        control.value.sort((a, b) => sortString(a.value, b.value));
        control.updateValueAndValidity();
        query$.mutate(v => v);
      },
      remove: (group: string, i: number) => {
        const control = form.controls[group];
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
    const stepLabel$ = toSignal(this.primaryDomains.selected$
      .pipe(map(selected => (selected.length === 1 && selected[0].key) || 'Enterprise Application')),
      { initialValue: 'Enterprise Application' });

    const form = new FormRecord<FormControl<SelectableOption<string>[]>>({});
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const size$ = signal(0);
    const fullSize$ = computed(() => this.domains.industries$().reduce((p, c) => p + c.industries.length, 0));
    const stopInput$ = computed(() => {
      const size = size$();
      return size >= 5 || size >= fullSize$();
    });

    form.addValidators((c) => {
      const v = c.value as Record<string, SelectableOption<string>[]>;
      const size = Object.values(v)
        .reduce((p, c) => p + c.length, 0);
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
          control = new FormControl([], { nonNullable: true });
          form.addControl(group, control);
        }
        control.value.push(option);
        control.value.sort((a, b) => sortString(a.value, b.value));
        control.updateValueAndValidity();
        query$.mutate(v => v);
      },
      remove: (group: string, i: number) => {
        const control = form.controls[group];
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

  private initJobCommitment() {
    const options = COMMITMENT_OPTIONS.map<SelectableOption<Commitment>>(v => ({
      selected: false,
      value: v,
      label: v
    }));

    const form = new FormControl(new Set<Commitment>(), {
      nonNullable: true,
      validators: [
        c => {
          const v = c.value as Set<Commitment>;
          if (v.size === 0)
            return { minlength: 1 };
          return null;
        }
      ]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const toggle = (option: SelectableOption<Commitment>) => {
      if (option.selected) {
        option.selected = false;
        form.value.delete(option.value);
      }
      else {
        option.selected = true;
        form.value.add(option.value);
      }
      form.updateValueAndValidity();
    }


    return { form, status$, options, toggle };
  }

  private initRateExpectation() {


    const form = new FormGroup({
      hourly: new FormControl(null as unknown as number, {
        nonNullable: true,
      }),
      monthly: new FormControl(null as unknown as number, {
        nonNullable: true,
      }),
      annually: new FormControl(null as unknown as number, {
        nonNullable: true,
      }),
    });

    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    return {
      form,
      status$,
    } as const;
  }

  private initPreferredRoles() {
    const injector = this.injector;

    const obs$ = this.primaryDomains.selected$
      .pipe(
        map(selected => {
          const exists = this.preferredRoles?.$()?.form.getRawValue();

          const form = new FormRecord<FormControl<SelectableOption<string>[]>>({});
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const options: Record<string, {
            query$: WritableSignal<string | object>,
            filtered$: Signal<SelectableOption<string>[]>,
            value$: Signal<SelectableOption<string>[]>,
            record: Record<string, SelectableOption<string>>,
            size$: Signal<number>,
            stopInput$: Signal<boolean>,
            add: (option: SelectableOption<string>) => void,
            remove: (i: number) => void,
          }> = {};

          selected.forEach(domain => {
            const size$ = signal(0);
            const totalRoles = domain.modules.reduce((p, c) => p + c.roles.length, 0);
            const stopInput$ = computed(() => {
              const size = size$();
              return size >= 5 || size >= totalRoles;
            });

            const roleForm = new FormControl([] as SelectableOption<string>[], {
              nonNullable: true,
              validators: [
                c => {
                  const length = (c.value as SelectableOption<string>[]).length;
                  size$.set(length);
                  if (length < 1)
                    return { minlength: 1 };
                  if (length > 5)
                    return { maxlength: 5 };
                  return null;
                }
              ]
            });

            const record: Record<string, SelectableOption<string>> = {};
            domain.modules.forEach(m => {
              m.roles.forEach(r => {
                const opt: SelectableOption<string> = {
                  selected: false,
                  value: r,
                  label: r
                };
                record[r] = opt;
              })
            });

            const list = Object.values(record)
              .sort((a, b) => sortString(a.value, b.value));

            const query$ = signal<string | object>('');
            const filtered$ = computed(() => {
              const q = query$();
              const filter = typeof q === 'string' && q.trim().toLowerCase();

              if (filter) {
                return list.filter(o => !o.selected && o.value.toLowerCase().includes(filter));
              }
              return list.filter(o => !o.selected);
            });

            form.addControl(domain.key, roleForm, { emitEvent: false });

            const value$ = toSignal(controlValue$(roleForm), { requireSync: true, injector });

            options[domain.key] = {
              query$,
              filtered$,
              value$,
              record,
              size$,
              stopInput$,
              add: (option) => {
                if (option.selected)
                  return;
                option.selected = true;
                const { value } = roleForm;
                value.push(option);
                value.sort((a, b) => sortString(a.value, b.value));
                roleForm.updateValueAndValidity();
                query$.mutate(v => v);
              },
              remove: (i) => {
                const { value } = roleForm;
                const option = value[i];
                value.splice(i, 1);
                option.selected = false;
                roleForm.updateValueAndValidity();
                query$.mutate(v => v);
              }
            }
          });

          if (exists) {
            Object.keys(exists).forEach(domain => {
              const roleForm = form.controls[domain];
              if (roleForm) {
                roleForm.setValue(exists[domain], { emitEvent: false });
              }
            });
          }

          form.updateValueAndValidity();

          const domains = selected;

          return { form, status$, options, domains } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
    const $ = toSignal(obs$);

    return { $ } as const;
  }

  private initPreferredWorkingHours() {

    const pfs$ = toSignal(controlValue$(this.professionalSummary.form, true));
    const loading$ = signal(true)

    const form = new FormGroup({
      timezone: new FormControl('', {
        validators: [
          Validators.required,
          isTimezone
        ],
        nonNullable: true
      }),
      start: new FormControl(null as unknown as string, {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }),
      end: new FormControl(null as unknown as string, {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }),
    });

    const allZones$ = signal<Timezone[]>([]);
    this.api.csc.allTimezones()
      .then(tz => {
        allZones$.set(tz);
        loading$.set(false);
      });

    const tzValue$ = toSignal(controlValue$(form.controls.timezone), { requireSync: true });

    const options = {
      timezone$: computed(() => {
        const all = allZones$();
        const value = tzValue$();
        const filter = value && value.trim().toLowerCase()
        if (filter)
          return all.filter(tz => tz.zoneName.toLowerCase().includes(filter));
        return all;
      }),
      hours: new Array<number>(24)
        .fill(0).map((_, i) => i)
        .map(hour => DateTime.fromObject({ hour }).toFormat('hh a'))
    }

    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    effect(() => {
      const opts = options.timezone$();
      const value = tzValue$()
      if (opts.length < 25) {
        const match = opts.find(o => o.tzName.toLowerCase() === value.trim().toLowerCase())
        if (match && match.zoneName.length === value.length && match.zoneName !== value) {
          form.controls.timezone.setValue(match.zoneName)
        }
      }
    }, { allowSignalWrites: true })

    effect(() => {
      const v = pfs$();
      if (!v)
        return;
      const { timezone } = v;
      const control = form.controls.timezone;
      const hasValidValue = (!this.isNew) || (control.valid)
      if (!hasValidValue)
        control.setValue(timezone);
    }, { allowSignalWrites: true })

    return {
      form,
      status$,
      options,
      loading$
    } as const;
  }

  private initJobSearchStatus() {
    const form = new FormControl(null as unknown as SelectableOption<JobSearchStatus>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = JOB_SEARCH_STATUS_OPTIONS
      .map<SelectableOption<JobSearchStatus>>(c => ({
        selected: false,
        value: c,
        label: c
      }));

    const toggle = (option: SelectableOption<JobSearchStatus>) => {
      if (option.selected)
        return;

      option.selected = true;
      const old = form.value;
      if (old) {
        old.selected = false;
      }
      form.setValue(option);
    }

    return { form, status$, options, toggle } as const;
  }

  private initAvailability() {
    const options = FREELANCER_AVAILABILITY_OPTIONS
      .map<SelectableOption<FreelancerAvailability>>(v => ({
        selected: false,
        value: v,
        label: v
      }));

    const form = new FormControl(null as unknown as SelectableOption<FreelancerAvailability>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const toggle = (option: SelectableOption<FreelancerAvailability>) => {
      if (option.selected)
        return;

      option.selected = true;
      const old = form.value;
      if (old) {
        old.selected = false;
      }
      form.setValue(option);
    }

    return { form, status$, options, toggle } as const;
  }

  private initProfileDetails() {
    type WorkHistoryForm = FormGroup<{
      role: FormControl<[string, string]>;
      duration: FormGroup<{
        start: FormControl<number>;
        end: FormControl<number | null>;
      }>;
      client: FormControl<string | null>;
      skills: FormControl<string | null>;
    }>;

    type EducationHistoryForm = FormGroup<{
      qualification: FormControl<string>,
      specialization: FormControl<string | null>,
      duration: FormGroup<{
        start: FormControl<number>;
        end: FormControl<number | null>;
      }>;
      institution: FormControl<string>;
      location: FormControl<string>;
    }>;

    const user = this.user();
    const form = new FormGroup({
      personalInfo: new FormGroup({
        firstName: new FormControl(
          user?.firstName, {
          nonNullable: true,
          validators: [Validators.required]
        }),
        lastName: new FormControl(
          user?.lastName, {
          nonNullable: true,
          validators: [Validators.required]
        }),
        citizenship: new FormControl('')
      }),
      contact: new FormGroup({
        email: new FormControl(
          user?.email, {
          nonNullable: true,
          validators: [Validators.required, Validators.email]
        }),
        phoneNumber: new FormGroup({
          mobile: new FormGroup({
            code: new FormControl(''),
            number: new FormControl(''),
          }),
          whatsapp: new FormGroup({
            code: new FormControl(''),
            number: new FormControl(''),
          }),
          telegram: new FormGroup({
            code: new FormControl(''),
            number: new FormControl(''),
          })
        }),
        address: new FormGroup({
          line1: new FormControl('', { nonNullable: true }),
          line2: new FormControl(''),
          city: new FormControl('', { nonNullable: true }),
          state: new FormControl('', { nonNullable: true }),
          country: new FormControl('', { nonNullable: true }),
          postalCode: new FormControl('', { nonNullable: true })
        })
      }),
      information: new FormGroup({
        currentRole: new FormControl(null as unknown as [string, string], {
          nonNullable: true,
          validators: [Validators.required]
        }),
        englishProficiency: new FormControl(null as unknown as SelectableOption<EnglishProficiency>, {
          nonNullable: true,
          validators: [Validators.required]
        })
      }),
      history: new FormGroup({
        work: new FormArray<WorkHistoryForm>([]),
        education: new FormArray<EducationHistoryForm>([]),
        portfolio: new FormControl('', {
          validators: [Validators.maxLength(2500)]
        })
      }),
      social: new FormGroup({
        linkedIn: new FormControl('', { validators: [Validators.pattern(pattern.linkedin.profile)] }),
        github: new FormControl('', { validators: [Validators.pattern(pattern.github.profile)] }),
        gitlab: new FormControl('', { validators: [Validators.pattern(pattern.gitlab.profile)] }),
      })
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const values = {
      citizenship: toSignal(controlValue$(form.controls.personalInfo.controls.citizenship), { requireSync: true }),
      phone: {
        mobile: {
          full: toSignal(controlValue$(form.controls.contact.controls.phoneNumber.controls.mobile), { requireSync: true }),
          code: toSignal(controlValue$(form.controls.contact.controls.phoneNumber.controls.mobile.controls.code), { requireSync: true }),
        },
        whatsapp: {
          full: toSignal(controlValue$(form.controls.contact.controls.phoneNumber.controls.whatsapp), { requireSync: true }),
          code: toSignal(controlValue$(form.controls.contact.controls.phoneNumber.controls.whatsapp.controls.code), { requireSync: true }),
        },
        telegram: {
          full: toSignal(controlValue$(form.controls.contact.controls.phoneNumber.controls.telegram), { requireSync: true }),
          code: toSignal(controlValue$(form.controls.contact.controls.phoneNumber.controls.telegram.controls.code), { requireSync: true }),
        },
      },
      address: {
        full: toSignal(controlValue$(form.controls.contact.controls.address), { requireSync: true }),
        country: toSignal(controlValue$(form.controls.contact.controls.address.controls.country), { requireSync: true }),
        state: toSignal(controlValue$(form.controls.contact.controls.address.controls.state), { requireSync: true }),
        city: toSignal(controlValue$(form.controls.contact.controls.address.controls.city), { requireSync: true })
      },
      work: toSignal(controlValue$(form.controls.history.controls.work), { requireSync: true }),
      education: toSignal(controlValue$(form.controls.history.controls.education), { requireSync: true })
    } as const;

    const allOptions = {
      countries: signal<Country[]>([]),
      countryCode: signal<(Country & { plainPhoneCode: string })[]>([]),
      state$: signal<State[]>([]),
      city$: signal<City[]>([]),
    } as const;

    function filterCountryCode(value$: Signal<string | null>) {
      return computed(() => {
        const all = allOptions.countryCode();
        const value = value$();
        const filter = value && value.replace(notNumber, '');
        if (filter)
          return all.filter(c => c.plainPhoneCode.toLowerCase().includes(filter));
        return all;
      });
    }

    const filteredOptions = {
      citizenship$: computed(() => {
        const value = values.citizenship();
        const all = allOptions.countries();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(c => c.name.toLowerCase().includes(filter));
        return all;
      }),
      mobileCode$: filterCountryCode(values.phone.mobile.code),
      whatsappCode$: filterCountryCode(values.phone.whatsapp.code),
      telegramCode$: filterCountryCode(values.phone.telegram.code),
      country$: computed(() => {
        const value = values.address.country();
        const all = allOptions.countries();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(c => c.name.toLowerCase().includes(filter));
        return all;
      }),
      state$: computed(() => {
        const value = values.address.state();
        const all = allOptions.state$();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(s => s.name.toLowerCase().includes(filter));
        return all;
      }),
      city$: computed(() => {
        const value = values.address.city();
        const all = allOptions.city$();
        const filter = value && value.trim().toLowerCase();
        if (filter)
          return all.filter(c => c.name.toLowerCase().includes(filter));
        return all;
      }),
      role$: computed(() => {
        const selected = this.roles.$()?.selected$() || {};
        const roles = Object.keys(selected)
          .flatMap(domain => selected[domain].map<[string, string]>(role => [domain, role]))
        return roles;
      }),
      english: ENGLISH_PROFICIENCY_OPTIONS
        .map<SelectableOption<EnglishProficiency>>(v => ({
          selected: false,
          value: v,
          label: v,
        })),
      years: new Array(DateTime.now().year - 1980 + 1)
        .fill(1980)
        .map((base, i) => base + i)
        .reverse()
    } as const;

    const english = {
      toggle: (option: SelectableOption<EnglishProficiency>) => {
        if (option.selected)
          return;

        option.selected = true;
        const old = form.value.information?.englishProficiency;
        if (old)
          old.selected = false;
        form.controls.information.controls.englishProficiency.setValue(option);
      }
    } as const;

    const validateDuration = (c: AbstractControl) => {
      const { start, end } = c.value;
      if (end && (!start || (end < start)))
        return { invalidEnd: true }

      return null;
    }

    const work = {
      add: () => {
        const arr = form.controls.history.controls.work;
        arr.push(new FormGroup({
          role: new FormControl(null as unknown as [string, string], {
            nonNullable: true,
            validators: [Validators.required]
          }),
          duration: new FormGroup({
            start: new FormControl(null as unknown as number, {
              nonNullable: true,
              validators: [Validators.required]
            }),
            end: new FormControl(null as unknown as number | null)
          }, {
            validators: [Validators.required]
          }),
          client: new FormControl('', {
            validators: [Validators.maxLength(300)]
          }),
          skills: new FormControl('', {
            validators: [Validators.maxLength(1000)]
          })
        }));
      },
      remove: (i: number) => {
        form.controls.history.controls.work.removeAt(i);
      },
    } as const;

    const education = {
      add: () => {
        const arr = form.controls.history.controls.education;
        arr.push(new FormGroup({
          qualification: new FormControl('', {
            validators: [Validators.maxLength(300)],
            nonNullable: true
          }),
          specialization: new FormControl('', {
            validators: [Validators.maxLength(300)],
          }),
          duration: new FormGroup({
            start: new FormControl(null as unknown as number, {
              nonNullable: true,
              validators: [Validators.required]
            }),
            end: new FormControl(null as unknown as number | null)
          }, {
            validators: [validateDuration]
          }),
          institution: new FormControl('', {
            validators: [Validators.maxLength(300)],
            nonNullable: true
          }),
          location: new FormControl('', {
            validators: [Validators.maxLength(300)],
            nonNullable: true
          })
        }));
      },
      remove: (i: number) => {
        form.controls.history.controls.education.removeAt(i);
      },
    } as const;

    // update the validators on the fly for the phone controls
    {
      type Form = FormGroup<{
        code: FormControl<string | null>;
        number: FormControl<string | null>;
      }>
      type FormValue = Form['value'];
      const telPattern = Validators.pattern(pattern.telephone);

      // eslint-disable-next-line no-inner-declarations
      function updatePhoneValidator(form: Form, value$: Signal<FormValue>) {

        const hasValue = computed(() => {
          const value = value$();
          return !!value.code || !!value.number;
        });

        const { code, number } = form.controls;
        effect(() => {
          if (hasValue()) {
            code.setValidators([Validators.required]);
            number.setValidators([Validators.required, telPattern]);
          }
          else {
            code.clearValidators();
            number.clearValidators();
          }

          code.updateValueAndValidity();
          number.updateValueAndValidity();

        }, { allowSignalWrites: true })
      }

      const { mobile, whatsapp, telegram } = form.controls.contact.controls.phoneNumber.controls;

      updatePhoneValidator(mobile, values.phone.mobile.full);
      updatePhoneValidator(whatsapp, values.phone.whatsapp.full);
      updatePhoneValidator(telegram, values.phone.telegram.full);
    }

    const isRequired = {
      line1$: signal(false).asReadonly(),
      country$: signal(false).asReadonly(),
      state$: signal(false).asReadonly(),
      city$: signal(false).asReadonly(),
      postalCode$: signal(false).asReadonly(),
    };

    // update the address validator on the fly
    {
      const hasValue = computed(() => {
        const value = values.address.full();
        return !!value.line1 || !!value.line2 ||
          !!value.city || !!value.state ||
          !!value.country || !!value.postalCode;
      });

      const { line1, city, state, country, postalCode } = form.controls.contact.controls.address.controls;

      isRequired.line1$ = hasValue;
      isRequired.country$ = hasValue;
      isRequired.state$ = computed(() => allOptions.state$().length > 0 && hasValue());
      isRequired.city$ = computed(() => allOptions.city$().length > 0 && hasValue());
      isRequired.postalCode$ = hasValue;

      // eslint-disable-next-line no-inner-declarations
      function dynamicallyRequired(
        required$: Signal<boolean>,
        control: FormControl
      ) {
        effect(() => {
          if (required$()) {
            control.addValidators(Validators.required);
          }
          else {
            control.removeValidators(Validators.required);
          }
          control.updateValueAndValidity();
        }, { allowSignalWrites: true });
      }

      dynamicallyRequired(isRequired.line1$, line1);
      dynamicallyRequired(isRequired.country$, country);
      dynamicallyRequired(isRequired.state$, state);
      dynamicallyRequired(isRequired.city$, city);
      dynamicallyRequired(isRequired.postalCode$, postalCode);
    }

    const loading = {
      country$: this.loading.has('pd-country'),
      state$: this.loading.has('pd-state'),
      city$: this.loading.has('pd-city'),
    } as const;

    // enable/disable the address controls and update the options
    {
      const { country, state, city, postalCode } = form.controls.contact.controls.address.controls;

      const status = {
        country: toSignal(controlStatus$(country), { requireSync: true }),
      } as const;

      const disabled = {
        state$: computed(() => loading.state$() || status.country() !== 'VALID'),
        city$: computed(() => loading.city$() || status.country() !== 'VALID')
      } as const;

      effect(() => disabled.state$() ? state.disable() : state.enable(), { allowSignalWrites: true });
      effect(() => disabled.city$() ? city.disable() : city.enable(), { allowSignalWrites: true });

      effect(async () => {
        const options = filteredOptions.country$();
        const value = values.address.country();

        state.reset();
        city.reset();
        postalCode.reset();

        allOptions.state$.set([]);
        allOptions.city$.set([]);

        if (options.length < 25) {
          const match = options.find(o => o.name.toLowerCase() === value.trim().toLowerCase());
          if (match) {
            this.loading.add('pd-state');
            if (match.name.length === value.length) {
              if (match.name !== value) {
                country.setValue(match.name);
              }
              else {
                const states = await this.api.csc.allStates(match.iso2);
                if (states.length) {
                  states.sort((a, b) => sortString(a.name, b.name));
                  allOptions.state$.set(states);
                }
                else {
                  this.loading.add('pd-city');
                  const cities = await this.api.csc.allCities(match.iso2);
                  cities.sort((a, b) => sortString(a.name, b.name));
                  allOptions.city$.set(cities);
                  this.loading.delete('pd-city')
                }
              }
            }
            this.loading.delete('pd-state');
          }
        }
      }, { allowSignalWrites: true });

      effect(async () => {
        const options = filteredOptions.state$();
        const value = values.address.state();

        city.reset();
        allOptions.city$.set([]);

        if (options.length < 25) {
          const match = options.find(o => o.name.toLowerCase() === value.trim().toLowerCase());
          if (match && match.name.length === value.length) {
            if (match.name !== value) {
              state.setValue(match.name);
            }
            else {
              this.loading.add('pd-city');
              let cities = await this.api.csc.allCities(match.country_code, match.iso2);
              if (!cities.length)
                cities = await this.api.csc.allCities(match.country_code, match.iso2);
              cities.sort((a, b) => sortString(a.name, b.name));
              allOptions.city$.set(cities);

              this.loading.delete('pd-city');
            }
          }
        }
      }, { allowSignalWrites: true });
    }

    const psf = toSignal(controlValue$(this.professionalSummary.form, true));
    const location$ = computed(() => {
      const v = psf();
      if (!v)
        return '';

      const { city, state, country } = v;
      return [city, state, country]
        .filter(i => !!i)
        .join(', ');
    });

    effect(() => {
      const options = filteredOptions.citizenship$();
      if (options.length < 25) {
        const country = values.citizenship();
        const match = country && options.find(o => o.name.toLowerCase() === country.trim().toLowerCase());
        if (match && match.name.length === country.length && match.name !== country) {
          form.controls.personalInfo.controls.citizenship.setValue(match.name);
        }
      }
    }, { allowSignalWrites: true });


    effect(() => {
      const v = psf();
      if (!v) return;
      const { country } = v;
      const control = form.controls.personalInfo.controls.citizenship;
      const hasValidValue = (!this.isNew) || (control.valid && control.value);
      if (!hasValidValue)
        form.controls.personalInfo.controls.citizenship.setValue(country);
    }, { allowSignalWrites: true });


    {
      this.loading.add('pd-country');
      this.allCountries
        .then(async countries => {
          allOptions.countries.set([...countries].sort((a, b) => sortString(a.name, b.name)));
          allOptions.countryCode.set(getPhoneCodeOptions(allOptions.countries()));

          this.loading.delete('pd-country');
        });
    }

    return {
      form,
      status$,
      location$,
      loading,
      options: filteredOptions,
      english,
      isRequired,
      work,
      education
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
      const { form, loading } = this.professionalSummary;
      form.reset({
        summary: 'some professional summary',
        experience: '2 to 5 years'
      });

      form.controls.country.setValue('India');

      await toPromise(loading.state$, v => v, this.injector);
      await toPromise(loading.state$, v => !v, this.injector);
      form.controls.state.setValue('West Bengal');

      await toPromise(loading.city$, v => v, this.injector);
      await toPromise(loading.city$, v => !v, this.injector);
      form.controls.city.setValue('Kolkata');

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

    {
      const { options, toggle } = this.jobCommittment;

      toggle(options[1]);

      this.stepper.next.click();
    }

    {
      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { domains, options } = this.preferredRoles.$()!;

      domains.forEach(domain => {
        const { filtered$, add } = options[domain.key];
        const [o1, o2] = filtered$();
        add(o1);
        add(o2);
      });

      this.stepper.next.click();
    }

    {
      const { form, options } = this.preferredWorkingHours;

      form.patchValue({
        start: options.hours[20],
        end: options.hours[2]
      });

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.jobSearchStatus;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { toggle, options } = this.availability;

      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { form, options, english, work, education } = this.profileDetails;

      form.controls.information.controls.currentRole.setValue(options.role$()[0]);
      english.toggle(options.english[0]);

      {
        work.add();
        const control = form.controls.history.controls.work.at(0);
        control.patchValue({
          client: 'Client 1',
          duration: {
            start: 2023
          },
          role: options.role$()[0],
          skills: 'Skill 1'
        })
      }

      {
        education.add();
        const control = form.controls.history.controls.education.at(0);
        control.patchValue({
          qualification: 'Some Qualification',
          specialization: 'Some Specialization',
          duration: {
            start: 2018,
            end: 2021
          },
          institution: 'Some institute',
          location: 'Some city, Some state, Some country'
        })
      }
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

  private async getCurrentLocation() {
    try {
      this.loading.add('getting geolocation');

      const device = this.injector.get(GeoLocationService);

      const fromDevice = await device.get(true)

      const coords: LatLng = fromDevice ?
        { lat: fromDevice.coords.latitude, lng: fromDevice.coords.longitude } :
        await this.api.gmap.geolocateByIPAddress()
          .then(r => r.location);


      const response = await this.api.gmap.reverseGeocode(coords, ['postal_code']);

      if (response.status !== 'OK')
        return null;

      const components = response.results[0].address_components

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
      this.loading.delete('getting geolocation');
    }
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
  'job-commitment' |
  'rate-expectation' |
  'preferred-roles' |
  'preferred-working-hours' |
  'job-search-status' |
  'availability' |
  'profile-details' |
  'end';

const notNumber = /[^\d\s]/g;

function getPhoneCodeOptions(countries: Country[]) {
  const mapped = [] as Country[];

  countries.forEach(c => {
    if (c.phonecode.includes('and')) {
      const codes = c.phonecode.split(' and ');
      codes.forEach(code => mapped.push({
        ...c,
        phonecode: code,
      }));
    }
    else mapped.push(c);
  });

  return mapped
    .map(c => ({
      ...c,
      plainPhoneCode: c.phonecode.replace(notNumber, '')
    }))
    .sort((a, b) => sortString(a.plainPhoneCode, b.plainPhoneCode))
}

const isTimezone = (control: AbstractControl<string | null>) => {
  if (control.value) {
    if (!IANAZone.isValidZone(control.value)) {
      return { invalid: true }
    }
  }
  return null;
}
