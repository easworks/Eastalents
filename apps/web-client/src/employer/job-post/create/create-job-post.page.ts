import { TextFieldModule } from '@angular/cdk/text-field';
import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, Signal, WritableSignal, computed, effect, inject, input, isDevMode, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenAIApi } from '@easworks/app-shell/api/open-ai';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { forceEmit } from '@easworks/app-shell/utilities/force-emit';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { sleep } from '@easworks/app-shell/utilities/sleep';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { Domain, DomainModule, ENGAGEMENT_PERIOD_OPTIONS, EngagementPeriod, HOURLY_BUDGET_OPTIONS, HourlyBudget, JobPost, JobPostStatus, PROJECT_KICKOFF_TIMELINE_OPTIONS, PROJECT_TYPE_OPTIONS, ProjectKickoffTimeline, ProjectType, REMOTE_WORK_OPTIONS, REQUIRED_EXPERIENCE_OPTIONS, RemoteWork, RequiredExperience, SERVICE_TYPE_OPTIONS, ServiceType, SoftwareProduct, WEEKLY_COMMITMENT_OPTIONS, WeeklyCommitment } from '@easworks/models';
import { faCheck, faCircleInfo, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, map, shareReplay, switchMap } from 'rxjs';
import { instructions } from './prompt';

@Component({
  selector: 'employer-create-job-post',
  templateUrl: './create-job-post.page.html',
  styleUrls: ['./create-job-post.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
    FormImportsModule,
    MatAutocompleteModule,
    MatSelectModule,
    TextFieldModule
  ]
})
export class CreateJobPostPageComponent implements OnInit {

  private readonly injector = inject(INJECTOR);
  private readonly domains = inject(DomainState);
  private readonly snackbar = inject(MatSnackBar);
  private readonly api = {
    openai: inject(OpenAIApi)
  } as const;

  protected readonly icons = {
    faCircleInfo,
    faSquareXmark,
    faCheck
  } as const;

  @HostBinding() private readonly class = 'page';

  private readonly loading = generateLoadingState<[
    'domains',
    'industries',
    'description from chatgpt'
  ]>();

  protected readonly mode$ = input<ComponentMode>('create', { alias: 'mode' });
  protected readonly editStep$ = input<Step | null>(null, { alias: 'step' });
  protected readonly jobPost$ = input<JobPost | null>(null, { alias: 'jobPost' });

  protected readonly trackBy = {
    domainOption: (_: number, d: SelectableOption<Domain>) => d.value.key,
    moduleOption: (_: number, m: SelectableOption<DomainModule>) => m.value.name,
    softwareOption: (_: number, s: SelectableOption<SoftwareProduct>) => s.value.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
    name: (_: number, i: { name: string; }) => i.name,
    key: (_: number, kv: KeyValue<string, unknown>) => kv.key
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly stepper = this.initStepper();
  protected readonly stepperGroups = this.initStepperGroups();

  protected readonly serviceType = this.initServiceType();
  protected readonly primaryDomain = this.initPrimaryDomain();
  protected readonly services = this.initServices();
  protected readonly modules = this.initModules();
  protected readonly roles = this.initRoles();
  protected readonly experience = this.initExperience();
  protected readonly techExp = this.initTechExp();
  protected readonly industries = this.initIndustries();
  protected readonly description = this.initDescription();
  protected readonly projectType = this.initProjectType();
  protected readonly requiredExp = this.initRequiredExp();
  protected readonly weeklyCommitment = this.initWeeklyCommitment();
  protected readonly engagementPeriod = this.initEngagementPeriod();
  protected readonly hourlyBudget = this.initHourlyBudget();
  protected readonly projectKickoffTimeline = this.initProjectKickoffTimeline();
  protected readonly remoteWork = this.initRemoteWork();

  private initStepper() {
    const order: Step[] = [
      'service-type',
      'primary-domain',
      'services',
      'modules',
      'roles',
      'experience',
      'technology-stack',
      'industry',
      'description',
      'project-type',
      'required-experience',
      'weekly-commitment',
      'engagement-period',
      'hourly-budget',
      'project-kickoff-timeline',
      'remote-work'
    ];
    const stepNumbers = order.reduce((prev, cv, ci) => {
      prev[cv] = ci;
      return prev;
    }, {} as Record<Step, number>);

    const step$ = signal<Step>(order[0]);

    const totalSteps = order.length;
    const stepIndex$ = computed(() => stepNumbers[step$()]);
    const progress$ = computed(() => {
      const s = stepIndex$();
      return {
        label: `Step ${s + 1} of ${totalSteps}`,
        percent: ((s) / totalSteps) * 100
      };
    });

    const firstStep = order[0];
    const lastStep = order.at(-1);


    const isValidStep = (step: Step) =>
      (step === 'service-type' && this.serviceType.status$() === 'VALID') ||
      (step === 'primary-domain' && this.primaryDomain.status$() === 'VALID') ||
      (step === 'services' && this.services.$()?.status$() === 'VALID') ||
      (step === 'modules' && this.modules.$()?.status$() === 'VALID') ||
      (step === 'roles' && this.roles.$()?.status$() === 'VALID') ||
      (step === 'experience' && this.experience.$()?.status$() === 'VALID') ||
      (step === 'technology-stack' && this.techExp.status$() === 'VALID') ||
      (step === 'industry' && this.industries.status$() === 'VALID') ||
      (step === 'description' && this.description.status$() === 'VALID') ||
      (step === 'project-type' && this.projectType.status$() === 'VALID') ||
      (step === 'required-experience' && this.requiredExp.status$() === 'VALID') ||
      (step === 'weekly-commitment' && this.weeklyCommitment.status$() === 'VALID') ||
      (step === 'engagement-period' && this.engagementPeriod.status$() === 'VALID') ||
      (step === 'hourly-budget' && this.hourlyBudget.status$() === 'VALID') ||
      (step === 'project-kickoff-timeline' && this.projectKickoffTimeline.status$() === 'VALID') ||
      (step === 'remote-work' && this.remoteWork.status$() === 'VALID');

    const next = {
      visible$: computed(() => step$() !== lastStep),
      disabled$: computed(() => {
        const step = step$();
        const wait = (
          step === 'primary-domain' ||
          step === 'technology-stack' ||
          step === 'industry'
        ) && this.loading.any$();

        if (wait)
          return true;
        return !isValidStep(step);
      }),
      click: () => {
        const current = stepIndex$();
        step$.set(order[current + 1]);
        document.scrollingElement?.scroll({ top: 0, behavior: 'smooth' });
      }
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
        const fv = {
          serviceType: this.serviceType.form.getRawValue(),
          projectType: this.projectType.form.getRawValue(),
          description: this.description.form.getRawValue(),
          commitment: this.weeklyCommitment.form.getRawValue(),
          engagementPeriod: this.engagementPeriod.form.getRawValue(),
          reqExp: this.requiredExp.form.getRawValue(),
          hourlyBudget: this.hourlyBudget.form.getRawValue(),
          projectKickoff: this.projectKickoffTimeline.form.getRawValue(),
          remote: this.remoteWork.form.getRawValue(),
          techExp: this.techExp.form.getRawValue(),
          industries: this.industries.form.getRawValue(),
          domain: this.primaryDomain.form.getRawValue(),
          services: this.services.$()?.form.getRawValue() || [],
          modules: this.modules.$()?.form.getRawValue() || [],
          experience: this.experience.$()?.form.getRawValue() || {},
        } as const;

        const jp: JobPost = {
          serviceType: fv.serviceType.value,
          projectType: fv.projectType.value,
          description: fv.description.description,
          requirements: {
            commitment: fv.commitment.value,
            engagementPeriod: fv.engagementPeriod.value,
            experience: fv.reqExp.value,
            hourlyBudget: fv.hourlyBudget.value,
            projectKickoff: fv.projectKickoff.value,
            remote: fv.remote.value,
          },
          domain: {
            key: fv.domain.domain.value.key,
            years: fv.domain.years,
            services: fv.services.map(v => v.value),
            modules: fv.modules.map(m => m.value.name),
            roles: {
              role: Object.keys(fv.experience)[0],
              quantity: fv.experience[Object.keys(fv.experience)[0]].quantity,
              years: fv.experience[Object.keys(fv.experience)[0]].years,
              software: fv.experience[Object.keys(fv.experience)[0]].software.map(v => v.value.name)
            },
          },
          tech: Object.entries(fv.techExp).map(([group, value]) => ({
            group,
            items: value.map(v => v.value)
          })),
          industries: Object.entries(fv.industries).map(([group, value]) => ({
            group,
            items: value.map(v => v.value)
          })),
          status: undefined as unknown as JobPostStatus
        };

        console.debug(jp);
      }
    } as const;

    return {
      totalSteps,
      step$,
      stepIndex$,
      progress$,
      isValidStep,
      next,
      prev,
      submit
    } as const;
  }

  private initStepperGroups() {
    type StepGroupID =
      'Services Selection' |
      'Primary Domain & Expertise' |
      'Role & Technical Experience' |
      'Industry & Job Details' |
      'Job Specifics';

    type StepGroup = {
      label: StepGroupID;
      enabled$: Signal<boolean>;
      completed$: Signal<boolean>;
      click: () => void;
    };

    const groupings: [StepGroupID, Step[]][] = [
      [
        'Services Selection',
        ['service-type']
      ],
      [
        'Primary Domain & Expertise',
        [
          'primary-domain',
          'services',
          'modules',
        ]
      ],
      [
        'Role & Technical Experience',
        [
          'roles',
          'experience',
          'technology-stack',
        ]
      ],
      [
        'Industry & Job Details',
        [
          'industry',
          'description',
        ]
      ],
      [
        'Job Specifics',
        [
          'project-type',
          'required-experience',
          'weekly-commitment',
          'engagement-period',
          'hourly-budget',
          'project-kickoff-timeline',
          'remote-work'
        ]
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

  private initServiceType() {
    const form = new FormControl(null as unknown as SelectableOption<ServiceType>, {
      nonNullable: true,
      validators: [Validators.required]
    });

    const options = SERVICE_TYPE_OPTIONS
      .map<SelectableOption<ServiceType>>(t => ({
        selected: false,
        value: t,
        label: t
      }));

    const handlers = {
      toggle: (option: SelectableOption<ServiceType>) => {
        if (option.selected)
          return;

        const old = form.value;
        option.selected = true;
        if (old)
          old.selected = false;
        form.setValue(option);
      }
    } as const;

    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const selected$ = controlValue$(form, true);

    return {
      form,
      status$,
      selected$,
      options,
      ...handlers
    } as const;
  }

  private initPrimaryDomain() {
    this.loading.react('domains', computed(() => this.domains.domains.list$().length === 0));
    const loading$ = this.loading.has('domains');

    const form = new FormGroup({
      domain: new FormControl(null as unknown as SelectableOption<Domain>, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      years: createYearControl()
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const selected$ = controlValue$(form, true);

    const domainStatus$ = toSignal(controlStatus$(form.controls.domain), { requireSync: true });
    const stopInput$ = computed(() => domainStatus$() === 'VALID');

    const options$ = computed(() => this.domains.domains.list$()
      .map<SelectableOption<Domain>>(d => ({
        selected: false,
        value: d,
        label: d.longName,
      })));

    const handlers = {
      toggle: (option: SelectableOption<Domain>) => {
        const old = form.controls.domain.value;
        form.reset();
        if (old) {
          old.selected = false;

          if (old === option) {
            form.setValue({
              domain: null as unknown as SelectableOption<Domain>,
              years: null as unknown as number
            });
            return;
          }
        }

        option.selected = true;
        form.setValue({
          domain: option,
          years: null as unknown as number,
        });
      }
    };

    return {
      loading$,
      form,
      status$,
      selected$,
      options$,
      stopInput$,
      ...handlers
    } as const;
  }

  private initServices() {
    const injector = this.injector;

    const stepLabel$ = toSignal(this.primaryDomain.selected$
      .pipe(map(selected => selected.domain.value.longName)));

    const obs$ = this.primaryDomain.selected$
      .pipe(
        map(selected => {
          const form = new FormControl([] as SelectableOption<string>[], {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.maxLength(7)
            ]
          });
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const options = selected.domain.value.services
            .map<SelectableOption<string>>(s => ({
              selected: false,
              value: s,
              label: s
            }));

          const value$ = toSignal(controlValue$(form), { requireSync: true, injector });
          const count$ = computed(() => value$().length);
          const stopInput$ = computed(() => count$() >= 7 || count$() >= options.length);

          const handlers = {
            toggle: (option: SelectableOption<string>) => {
              option.selected = !option.selected;
              form.setValue(options.filter(o => o.selected));
            }
          } as const;

          return {
            form,
            status$,
            count$,
            stopInput$,
            options,
            ...handlers
          } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);

    return {
      $,
      stepLabel$
    } as const;
  }

  private initModules() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = this.primaryDomain.selected$
      .pipe(
        map(selected => {
          const form = new FormControl([] as SelectableOption<DomainModule>[], {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.maxLength(7)
            ]
          });
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });
          const value$ = toSignal(controlValue$(form), { requireSync: true, injector });

          const options = selected.domain.value.modules
            .map<SelectableOption<DomainModule>>(m => ({
              selected: false,
              value: m,
              label: m.name
            }));

          const count$ = computed(() => value$().length);
          const stopInput$ = computed(() => count$() >= 7 || count$() >= options.length);

          const handlers = {
            toggle: (option: SelectableOption<DomainModule>) => {
              option.selected = !option.selected;
              form.setValue(options.filter(o => o.selected));
            }
          } as const;

          const selected$ = controlValue$(form, true)
            .pipe(
              map(selected => selected.map(o => o.value)),
              shareReplay({ refCount: true, bufferSize: 1 }));

          return {
            form,
            status$,
            selected$,
            count$,
            stopInput$,
            options,
            ...handlers
          } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(o => o.selected$),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    return {
      $,
      selected$,
      stepLabel$
    } as const;
  }

  private initRoles() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = combineLatest([
      this.serviceType.selected$,
      this.primaryDomain.selected$,
    ]).pipe(
      map(([serviceType, { domain }]) => {
        const exists = this.roles?.$()?.form.getRawValue();
        const limit = serviceType.value === 'Hire an Enterprise Application Talent' ?
          1 : 5;

        const form = new FormControl([] as SelectableOption<string>[], {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(limit),
          ]
        });
        const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });
        const value$ = toSignal(controlValue$(form), { requireSync: true, injector });

        const allRoles = domain.value.modules
          .flatMap(m => m.roles);
        const options = [...new Set(allRoles)]
          .map<SelectableOption<string>>(r => ({
            selected: false,
            value: r,
            label: r
          }));

        const count$ = computed(() => value$().length);
        const stopInput$ = computed(() => {
          const c = count$();
          return c >= limit || c >= options.length;
        });


        const handlers = {
          toggle: (option: SelectableOption<string>) => {
            option.selected = !option.selected;
            form.setValue(options.filter(o => o.selected));
          }
        } as const;

        if (exists && (limit > 1) && (exists.length <= limit)) {
          exists.forEach(old => {
            const opt = options.find(o => o.value === old.value);
            if (opt)
              opt.selected = true;
          });
          form.setValue(options.filter(o => o.selected));
        }

        const selected$ = controlValue$(form, true)
          .pipe(
            map(v => v.map(o => o.value).sort(sortString)),
            shareReplay({ refCount: true, bufferSize: 1 }));

        return {
          form,
          status$,
          selected$,
          limit,
          count$,
          stopInput$,
          options,
          ...handlers
        } as const;
      }),
      shareReplay({ refCount: true, bufferSize: 1 }));

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(f => f.selected$),
      shareReplay({ refCount: true, bufferSize: 1 }));

    return {
      $,
      selected$,
      stepLabel$
    } as const;
  }

  private initExperience() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = combineLatest([
      this.serviceType.selected$,
      this.roles.selected$,
    ]).pipe(
      map(([serviceType, roles]) => {
        const exists = this.experience?.$()?.form.getRawValue();

        const individual = serviceType.value === 'Hire an Enterprise Application Talent';


        const form = new FormRecord<FormGroup<{
          quantity: FormControl<number>;
          years: FormControl<number>;
          software: FormControl<SelectableOption<SoftwareProduct>[]>;
        }>>({});
        const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

        const software: Record<string, {
          readonly value$: Signal<SelectableOption<SoftwareProduct>[]>,
          readonly query$: WritableSignal<string>,
          readonly options$: Signal<SelectableOption<SoftwareProduct>[]>,
          readonly allOptions: SelectableOption<SoftwareProduct>[];
          readonly count$: Signal<number>;
          readonly stopInput$: Signal<boolean>;
          readonly add: (option: SelectableOption<SoftwareProduct>) => void;
          readonly remove: (i: number) => void;
        }> = {};

        const allSoftwareProducts = this.primaryDomain.form.getRawValue()
          .domain.value.products
          .map<SelectableOption<SoftwareProduct>>(p => ({
            selected: false,
            value: p,
            label: p.name
          }));

        roles.forEach(role => {
          const roleForm = new FormGroup({
            quantity: new FormControl(1, {
              nonNullable: true,
              validators: [Validators.required]
            }),
            years: createYearControl(),
            software: new FormControl(
              [] as SelectableOption<SoftwareProduct>[], {
              nonNullable: true,
              validators: [Validators.required, Validators.maxLength(5)],
            })
          });

          const softwareControl = roleForm.controls.software;
          const softwareValue$ = toSignal(controlValue$(softwareControl), { requireSync: true, injector });

          const count$ = computed(() => softwareValue$().length);
          const stopInput$ = computed(() => count$() >= 5 || count$() >= allSoftwareProducts.length);

          const allOptions = structuredClone(allSoftwareProducts);
          const query$ = signal('');
          const options$ = computed(() => {
            const q = query$();

            const filter = q && q.trim().toLowerCase();
            if (filter) {
              return allOptions.filter(o => !o.selected && o.label?.toLowerCase().includes(filter));
            }

            return allOptions.filter(o => !o.selected);
          });

          const updateSoftwareValue = () => {
            softwareControl.setValue(allOptions.filter(o => o.selected));
            forceEmit(query$);
          };

          software[role] = {
            value$: softwareValue$,
            query$,
            allOptions,
            options$,
            count$,
            stopInput$,
            add: (option: SelectableOption<SoftwareProduct>) => {
              if (option.selected)
                return;
              option.selected = true;
              updateSoftwareValue();
            },
            remove: (i: number) => {
              const opt = softwareControl.value[i];
              opt.selected = false;
              updateSoftwareValue();

            }
          } as const;

          form.registerControl(role, roleForm);

        });

        if (exists) {
          for (const role in exists) {
            const roleControl = form.controls[role];
            if (roleControl) {
              roleControl.patchValue({
                years: exists[role].years,
                quantity: individual ? 1 : exists[role].quantity,
                software: software[role].allOptions
                  .filter(o => exists[role].software
                    .some(s => s.value.name === o.value.name))
              }, { emitEvent: false });
            }
          }

          form.updateValueAndValidity();
        }

        const selected$ = controlValue$(form, true);

        return {
          form,
          status$,
          selected$,
          software,
          roles,
          individual
        } as const;
      }),
      shareReplay({ refCount: true, bufferSize: 1 }));

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(f => f.selected$),
      shareReplay({ refCount: true, bufferSize: 1 }));

    return {
      $,
      selected$,
      stepLabel$
    } as const;
  }

  private initTechExp() {

    const stepLabel$ = this.roles.stepLabel$;

    const loading$ = this.loading.has('domains');

    const count$ = signal(0);
    const form = new FormRecord<FormControl<SelectableOption<string>[]>>({}, {
      validators: [
        c => {
          const value = c.value as Record<string, []>;
          const count = Object.values(value).reduce((p, c) => p + c.length, 0);
          count$.set(count);
          if (count === 0) {
            return { minlength: true };
          }
          return null;
        }
      ]
    });
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const fullSize$ = computed(() => this.domains.tech.list$().reduce((p, c) => p + c.items.size, 0));
    const stopInput$ = computed(() => count$() >= fullSize$());

    const query$ = signal<string | object>('');

    type OptionGroup = {
      name: string;
      tech: SelectableOption<string>[];
    };
    const all$ = computed(() => this.domains.tech.list$()
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
        if (option.selected)
          return;
        option.selected = true;
        let control = form.controls[group];
        if (!control) {
          control = new FormControl([], { nonNullable: true });
          form.addControl(group, control);
        }
        control.value.push(option);
        control.value.sort((a, b) => sortString(a.value, b.value));
        control.updateValueAndValidity();
        forceEmit(query$);
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
        forceEmit(query$);
      }
    } as const;

    {
      const selected$ = toSignal(this.experience.selected$);

      effect(() => {
        const selected = selected$();
        if (selected) {
          const all = all$();

          const selectedSoftware = new Set<SoftwareProduct>();
          Object.values(selected)
            .forEach(v =>
              v.software?.forEach(s =>
                selectedSoftware.add(s.value)));

          const list = [...selectedSoftware].flatMap(s => s.tech);
          list.forEach(lg => {
            const og = all.find(g => g.name === lg.name);
            if (!og)
              throw new Error('invalid operation');
            lg.items.forEach(li => {
              const opt = og.tech.find(t => t.value === li);
              if (!opt)
                throw new Error('invalid operation');
              handlers.add(og.name, opt);
            });
          });

        }
      }, { allowSignalWrites: true });
    }

    return {
      form,
      value$,
      status$,
      query$,
      options$: filtered$,
      count$,
      stopInput$,
      loading$,
      stepLabel$,
      ...handlers
    } as const;
  }

  private initIndustries() {
    {
      this.loading.add('industries');
      this.domains.loadIndustries()
        .then(() => this.loading.delete('industries'));
    }

    const loading$ = this.loading.has('industries');

    const stepLabel$ = toSignal(this.primaryDomain.selected$
      .pipe(map(selected => selected.domain.value.key)));

    const form = new FormRecord<FormControl<SelectableOption<string>[]>>({});
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const count$ = signal(0);
    const fullSize$ = computed(() => this.domains.industries$().reduce((p, c) => p + c.industries.length, 0));
    const stopInput$ = computed(() => {
      const count = count$();
      return count >= 5 || count >= fullSize$();
    });

    form.addValidators((c) => {
      const v = c.value as Record<string, SelectableOption<string>[]>;
      const count = Object.values(v)
        .reduce((p, c) => p + c.length, 0);
      count$.set(count);
      if (count === 0)
        return { minlength: 1 };
      if (count > 5)
        return { maxlength: 5 };
      return null;
    });
    form.updateValueAndValidity();

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
        forceEmit(query$);
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
        forceEmit(query$);
      }
    } as const;

    return {
      form,
      value$,
      status$,
      query$,
      options$: filtered$,
      count$,
      stopInput$,
      stepLabel$,
      loading$,
      ...handlers
    } as const;
  }

  private initDescription() {

    const roles$ = toSignal(this.roles.selected$);
    const domains$ = toSignal(this.primaryDomain.selected$);

    const input$ = signal('');
    const generating$ = this.loading.has('description from chatgpt');

    const stepLabel$ = computed(() => {
      const roles = roles$();
      if (roles) {
        const single = roles.length === 1 && roles[0];
        if (single)
          return single;
      }
      return domains$()?.domain.value.longName;
    });

    const form = new FormGroup({
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(4000)]
      })
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    effect(() => {
      if (this.stepper.step$() === 'description') {
        input$.set(this.extractChatGPTInput());
      }
    }, { allowSignalWrites: true });

    effect(async () => {
      const mode = this.mode$();
      if (mode === 'edit')
        return;

      const input = input$();
      if (input) {
        const description = await this.generateDescriptionFromChatGPT(input);
        if (description)
          form.patchValue({ description });
      }

    }, { allowSignalWrites: true });

    return {
      form,
      status$,
      stepLabel$,
      generating$
    } as const;
  }

  private initProjectType() {
    const stepLabel$ = this.services.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<ProjectType>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = PROJECT_TYPE_OPTIONS.map<SelectableOption<ProjectType>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<ProjectType>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private initRequiredExp() {
    const stepLabel$ = this.description.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<RequiredExperience>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = REQUIRED_EXPERIENCE_OPTIONS.map<SelectableOption<RequiredExperience>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<RequiredExperience>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private initWeeklyCommitment() {
    const stepLabel$ = this.description.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<WeeklyCommitment>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = WEEKLY_COMMITMENT_OPTIONS.map<SelectableOption<WeeklyCommitment>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<WeeklyCommitment>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private initEngagementPeriod() {
    const stepLabel$ = this.description.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<EngagementPeriod>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = ENGAGEMENT_PERIOD_OPTIONS.map<SelectableOption<EngagementPeriod>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<EngagementPeriod>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private initHourlyBudget() {
    const stepLabel$ = this.description.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<HourlyBudget>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = HOURLY_BUDGET_OPTIONS.map<SelectableOption<HourlyBudget>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<HourlyBudget>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private initProjectKickoffTimeline() {
    const stepLabel$ = this.description.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<ProjectKickoffTimeline>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = PROJECT_KICKOFF_TIMELINE_OPTIONS.map<SelectableOption<ProjectKickoffTimeline>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<ProjectKickoffTimeline>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private initRemoteWork() {
    const stepLabel$ = this.description.stepLabel$;
    const form = new FormControl(null as unknown as SelectableOption<RemoteWork>, {
      nonNullable: true,
      validators: [Validators.required]
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const options = REMOTE_WORK_OPTIONS.map<SelectableOption<RemoteWork>>(pt => ({
      selected: false,
      value: pt,
      label: pt
    }));

    const handlers = {
      toggle: (option: SelectableOption<RemoteWork>) => {
        if (option.selected)
          return;

        const old = form.value;
        if (old)
          old.selected = false;
        option.selected = true;
        form.setValue(option);
      }
    } as const;

    return {
      form,
      status$,
      options,
      stepLabel$,
      ...handlers
    };
  }

  private async devModeInit() {
    const injector = this.injector;
    const revert = [] as (() => void)[];

    {
      const { options, toggle } = this.serviceType;
      toggle(options[1]);

      this.stepper.next.click();
    }

    {
      const { options$, toggle, form } = this.primaryDomain;

      const all = await toPromise(options$, all => all.length > 0, this.injector);

      const scm = all.find(o => o.value.key === 'SCM');
      if (!scm)
        throw new Error('invalid operation');

      toggle(scm);
      form.patchValue({ years: 2 });

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { toggle, options } = this.services.$()!;
      toggle(options[0]);
      toggle(options[1]);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { toggle, options } = this.modules.$()!;

      toggle(options[0]);
      toggle(options[1]);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options, toggle } = this.roles.$()!;

      toggle(options[0]);
      toggle(options[1]);

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { form, software } = this.experience.$()!;

      Object.entries(software)
        .forEach(([role, { add, allOptions }], i) => {
          const roleControl = form.controls[role];
          roleControl.patchValue({
            quantity: i + 1,
            years: i + 2
          });

          const startIndex = i * 2;
          add(allOptions[startIndex]);
          add(allOptions[startIndex + 1]);
        });

      this.stepper.next.click();
    }

    {
      // this is to ensure that the tech is all filled
      await sleep();
      this.stepper.next.click();
    }

    {
      const { options$, add } = this.industries;
      const o = options$();

      add(o[0].name, o[0].industries[0]);
      add(o[0].name, o[0].industries[1]);
      add(o[0].name, o[0].industries[2]);
      add(o[1].name, o[1].industries[0]);

      this.stepper.next.click();
    }

    {
      await sleep();
      await toPromise(this.description.generating$, v => !v, injector);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.projectType;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.requiredExp;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.weeklyCommitment;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.engagementPeriod;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.hourlyBudget;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.projectKickoffTimeline;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options, toggle } = this.remoteWork;
      toggle(options[0]);
    }

    revert.forEach(r => r());
  }

  private extractChatGPTInput() {
    const fv = {
      serviceType: this.serviceType.form.getRawValue(),
      domains: this.primaryDomain.form.getRawValue(),
      modules: this.modules.$()?.form.getRawValue() || [],
      services: this.services.$()?.form.getRawValue() || [],
      experience: this.experience.$()?.form.getRawValue() || {},
      tech: this.techExp.form.getRawValue(),
      industries: this.industries.form.getRawValue()
    } as const;

    const recruitmentType = `Recruitement Type: ${fv.serviceType.value === 'Hire an Enterprise Application Talent' ? 'Hire an Individual' : fv.serviceType.value}`;
    const domain = `Business Domain: ${fv.domains.domain.value.longName}`;
    const subDomains = [
      `Sub-domain(s):`,
      ...fv.modules.map(v => `- ${v.value.name}`)
    ].join('\n');

    const purpose = [
      'General purpose for which we are hiring:',
      ...fv.services.map(v => `- ${v.value}`)
    ].join('\n');


    const requiredExp = 'Required Experience: \n' + Object.entries(fv.experience)
      .map(([role, { years, quantity, software }]) => ({
        role, years, quantity,
        software: software.map(v => v.value.name),
      }))
      .flatMap(v => [
        `- Role: ${v.role}`,
        `  No. of recruits: ${v.quantity}`,
        `  Required experience: ${v.years} years`,
        `  Software: ${v.software.join('; ')}`
      ]).join('\n');

    const tech = 'Technology Stack: \n' + Object.entries(fv.tech)
      .map(([ig, items]) => '- ' + `${ig}: ${items.map(i => i.value).join('; ')}`)
      .join('\n');

    const industries = 'Industries: \n' + Object.entries(fv.industries)
      .map(([ig, items]) => '- ' + `${ig}: ${items.map(i => i.value).join('; ')}`)
      .join('\n');

    return [
      recruitmentType,
      domain,
      subDomains,
      purpose,
      requiredExp,
      tech,
      industries
    ].join('\n\n');
  }

  private generateDescriptionFromChatGPT(input: string) {
    this.loading.add('description from chatgpt');

    return this.api.openai.chat([
      {
        role: 'user',
        content: `
          \`\`\`
          ${input}
          \`\`\`

          ${instructions}`
      },
      { role: 'user', content: input },
    ])
      .then(r => r.message.content)
      .catch(e => {
        console.error(e);
        this.snackbar.openFromComponent(SnackbarComponent, {
          ...ErrorSnackbarDefaults,
          data: {
            message: 'Error while generating description'
          }
        });
        return null;
      })
      .finally(() => this.loading.delete('description from chatgpt'));

  }


  private async prefill(jobPost: JobPost) {
    {
      const { options, toggle } = this.serviceType;
      const selected = options.find(x => x.value === jobPost.serviceType);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }
    {
      const { options$, toggle, form } = this.primaryDomain;

      const all = await toPromise(options$, all => all.length > 0, this.injector);

      const domain = all.find(o => o.value.key === jobPost.domain.key);
      if (!domain)
        throw new Error('invalid operation');

      toggle(domain);
      form.patchValue({ years: jobPost.domain.years });

    }

    {
      const { toggle, options } = this.services.$()!;
      jobPost.domain.services.forEach(x => {
        const selected = options.find(y => y.value === x);
        if (!selected) {
          throw new Error('invalid operation');
        }
        toggle(selected);
      });
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { toggle, options } = this.modules.$()!;


      jobPost.domain.modules.forEach(x => {
        const selected = options.find(y => y.value.name === x);
        if (!selected) {
          throw new Error('invalid operation');
        }
        toggle(selected);
      });
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { options, toggle } = this.roles.$()!;

      const selected = options.find(x => x.value === jobPost.domain.roles.role);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { form, software } = this.experience.$()!;  //experinece to check

      Object.entries(software)
        .forEach(([role, { add, allOptions }]) => {
          const roleControl = form.controls[role];
          roleControl.patchValue({
            quantity: jobPost.domain.roles.quantity,
            years: jobPost.domain.roles.years
          });

          jobPost.domain.roles.software.forEach(x => {
            const index = allOptions.findIndex(y => y.value.name === x);
            if (index === -1) {
              throw new Error('invalid operation');
            }
            add(allOptions[index]);
          });
        });
    }

    {
      // this is to ensure that the tech is all filled
      const { add, options$ } = this.techExp;

      const options = await toPromise(options$, options => options.length > 0, this.injector);
      const map = new Map(options.map(g => [g.name, g.tech]));

      jobPost.tech.forEach(group => {
        const optionGroup = map.get(group.group);
        if (!optionGroup) {
          console.warn(`invalid operation: did not find tech group '${group.group}'`);
          return;
        }

        group.items.forEach(item => {
          const option = optionGroup.find(o => o.value === item);
          if (!option) {
            console.warn(`invalid operation: did not find tech '${item}' in group '${group.group}'`);
            return;
          }

          add(group.group, option);
        });
      });
    }

    {
      const { options$, add } = this.industries;

      const options = await toPromise(options$, options => options.length > 0, this.injector);
      const map = new Map(options.map(g => [g.name, g.industries]));

      jobPost.industries.forEach(group => {
        const optionGroup = map.get(group.group);
        if (!optionGroup) {
          console.warn(`invalid operation: did not find industry group '${group.group}'`);
          return;
        }

        group.items.forEach(item => {
          const option = optionGroup.find(o => o.value === item);
          if (!option) {
            console.warn(`invalid operation: did not find industry '${item}' in group '${group.group}'`);
            return;
          }

          add(group.group, option);
        });
      });
    }


    {
      const { form } = this.description;
      form.setValue({ description: jobPost.description });

    }
    {
      const { options, toggle } = this.projectType;
      const selected = options.find(x => x.value === jobPost.projectType);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      const { options, toggle } = this.requiredExp;
      const selected = options.find(x => x.value === jobPost.requirements.experience);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      const { options, toggle } = this.weeklyCommitment;
      const selected = options.find(x => x.value === jobPost.requirements.commitment);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      const { options, toggle } = this.engagementPeriod;
      const selected = options.find(x => x.value === jobPost.requirements.engagementPeriod);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      const { options, toggle } = this.hourlyBudget;
      const selected = options.find(x => x.value === jobPost.requirements.hourlyBudget);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      const { options, toggle } = this.projectKickoffTimeline;
      const selected = options.find(x => x.value === jobPost.requirements.projectKickoff);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

    {
      const { options, toggle } = this.remoteWork;
      const selected = options.find(x => x.value === jobPost.requirements.remote);
      if (!selected) {
        throw new Error('invalid operation');
      }

      toggle(selected);
    }

  }
  ngOnInit(): void {
    if (isDevMode()) {
      // this.devModeInit();
    }

    effect(async () => {
      const mode = this.mode$();
      if (mode === 'edit') {
        const jP = this.jobPost$();

        if (!jP) {
          throw new Error('invalid operation: job post to be prefilled was not provided');
        }

        await untracked(() => this.prefill(jP));

        const step = this.editStep$();
        const isValidStep = step && this.stepper.isValidStep(step);
        if (isValidStep) {
          this.stepper.step$.set(step);
        }
        else if (step) {
          console.warn(`trying to navigate to invalid step: '${step}'`);
        }
      }
    }, { injector: this.injector });
  }

}

type Step =
  'service-type' |
  'primary-domain' |
  'services' |
  'modules' |
  'roles' |
  'experience' |
  'technology-stack' |
  'industry' |
  'description' |
  'project-type' |
  'required-experience' |
  'weekly-commitment' |
  'engagement-period' |
  'hourly-budget' |
  'project-kickoff-timeline' |
  'remote-work';


type ComponentMode = 'create' | 'edit';

function createYearControl(initialValue = null as unknown as number) {
  return new FormControl(
    initialValue,
    {
      validators: [Validators.required, Validators.min(1), Validators.max(30)],
      nonNullable: true
    }
  );
}
