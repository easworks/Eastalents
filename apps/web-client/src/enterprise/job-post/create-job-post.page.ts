import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { Domain, DomainModule, DomainProduct } from '@easworks/app-shell/api/talent.api';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { PROJECT_TYPE_OPTIONS, ProjectType, REQUIRED_EXPERIENCE_OPTIONS, RequiredExperience, SERVICE_TYPE_OPTIONS, ServiceType, WEEKLY_COMMITMENT_OPTIONS, WeeklyCommitment } from '@easworks/models';
import { map, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'enterprise-create-job-post',
  templateUrl: './create-job-post.page.html',
  styleUrls: ['./create-job-post.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
    FormImportsModule,
    MatAutocompleteModule
  ]
})
export class CreateJobPostPageComponent implements OnInit {
  private readonly injector = inject(INJECTOR);
  private readonly domains = inject(DomainState);

  @HostBinding() private readonly class = 'page'

  private readonly loading = generateLoadingState<[
    'domains',
    'technologies',
    'industries'
  ]>();


  protected readonly trackBy = {
    domainOption: (_: number, d: SelectableOption<Domain>) => d.value.key,
    moduleOption: (_: number, m: SelectableOption<DomainModule>) => m.value.name,
    softwareOption: (_: number, s: SelectableOption<DomainProduct>) => s.value.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
    name: (_: number, i: { name: string }) => i.name,
    key: (_: number, kv: KeyValue<string, unknown>) => kv.key
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly stepper = this.initStepper();

  protected readonly serviceType = this.initServiceType();
  protected readonly primaryDomain = this.initPrimaryDomain();
  protected readonly services = this.initServices();
  protected readonly modules = this.initModules();
  protected readonly software = this.initSoftware();
  protected readonly roles = this.initRoles();
  protected readonly techExp = this.initTechExp();
  protected readonly industries = this.initIndustries();
  protected readonly description = this.initDescription();
  protected readonly projectType = this.initProjectType();
  protected readonly requiredExp = this.initRequiredExp();
  protected readonly weeklyCommitment = this.initWeeklyCommitment();


  private initStepper() {
    const order: Step[] = [
      'service-type',
      'primary-domain',
      'services',
      'modules',
      'software',
      'roles',
      'technology-stack',
      'industry',
      'description',
      'project-type',
      'required-experience',
      'weekly-commitment',
      'engagement-period',
      // 'estimated-budget',
      // 'starting-period',
      // 'remote-work'
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
      }
    });

    const firstStep = order[0];
    const lastStep = order.at(-1);


    const isValidStep = (step: Step) =>
      (step === 'service-type' && this.serviceType.status$() === 'VALID') ||
      (step === 'primary-domain' && this.primaryDomain.status$() === 'VALID') ||
      (step === 'services' && this.services.$()?.status$() === 'VALID') ||
      (step === 'modules' && this.modules.$()?.status$() === 'VALID') ||
      (step === 'software' && this.software.$()?.status$() === 'VALID') ||
      (step === 'roles' && this.roles.$()?.status$() === 'VALID') ||
      (step === 'technology-stack' && this.techExp.status$() === 'VALID') ||
      (step === 'industry' && this.industries.status$() === 'VALID') ||
      (step === 'description' && this.description.status$() === 'VALID') ||
      (step === 'project-type' && this.projectType.status$() === 'VALID') ||
      (step === 'required-experience' && this.requiredExp.status$() === 'VALID') ||
      (step === 'weekly-commitment' && this.weeklyCommitment.status$() === 'VALID');

    const next = {
      visible$: computed(() => step$() !== lastStep),
      disabled$: computed(() => this.loading.any$() || !isValidStep(step$())),
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
        // 
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

  private initServiceType() {
    const form = new FormControl(null as unknown as SelectableOption<ServiceType>, {
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
        form.setValue(option)
      }
    } as const;

    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    return {
      form,
      status$,
      options,
      ...handlers
    } as const;
  }

  private initPrimaryDomain() {
    const loading$ = this.loading.has('domains');

    const form = new FormGroup({
      domain: new FormControl(null as unknown as SelectableOption<Domain>, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      years: createYearControl()
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });
    const selected$ = controlValue$(form, true)
      .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    const domainStatus$ = toSignal(controlStatus$(form.controls.domain), { requireSync: true });
    const stopInput$ = computed(() => domainStatus$() === 'VALID');

    const options$ = computed(() => this.domains.domains$()
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
    }

    const loadingDomain = this.domains.loading.has('domains');
    effect(() => {
      if (loadingDomain())
        this.loading.add('domains');
      else
        this.loading.delete('domains');
    }, { allowSignalWrites: true })

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
          } as const
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
          const stopInput$ = computed(() => count$() >= 7 || count$() <= options.length);

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

  private initSoftware() {
    const injector = this.injector;

    const stepLabel$ = this.services.stepLabel$;

    const obs$ = this.modules.selected$
      .pipe(
        map(selected => {
          const exists = this.software?.$()?.form.getRawValue();

          const count$ = signal(0);
          const form = new FormRecord<FormControl<number>>({}, {
            validators: [
              c => {
                const count = Object.keys(c.value).length;
                count$.set(count);
                if (count < 1)
                  return { minlength: 1 };
                if (count > 5)
                  return { maxlength: 5 };
                return null;
              }
            ]
          });
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const optionSet = new Set<string>();
          const options: SelectableOption<DomainProduct>[] = [];
          selected.forEach(m => m.products.forEach(p => {
            if (optionSet.has(p.name))
              return;

            optionSet.add(p.name);
            options.push({
              selected: false,
              value: p,
              label: p.name
            });
          }));
          options.sort((a, b) => sortString(a.value.name, b.value.name));

          const stopInput$ = computed(() => count$() >= 5 || count$() >= options.length);

          const handlers = {
            toggle: (option: SelectableOption<DomainProduct>) => {
              if (option.selected) {
                option.selected = false;
                form.removeControl(option.value.name);
              }
              else {
                option.selected = true;
                form.addControl(option.value.name, createYearControl());
              }
            }
          } as const;

          if (exists) {
            Object.keys(exists).forEach(software => {
              const option = options.find(o => o.value.name === software);
              if (option) {
                option.selected = true;
                form.addControl(option.value.name, createYearControl(exists[software]), { emitEvent: false });
              }
            })
          };
          form.updateValueAndValidity();

          const selected$ = controlValue$(form, true)
            .pipe(
              map(v => Object.keys(v)
                .map(k => {
                  const found = options.find(o => o.value.name === k);
                  if (!found)
                    throw new Error('invalid operation');
                  return found.value;
                })
              ),
              shareReplay({ refCount: true, bufferSize: 1 }));

          return {
            form,
            status$,
            count$,
            stopInput$,
            selected$,
            options,
            ...handlers
          } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 }));

    const $ = toSignal(obs$);
    const selected$ = obs$.pipe(
      switchMap(f => f.selected$),
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

    const selectedSoftware$ = toSignal(this.software.selected$)
    const stepLabel$ = computed(() => {
      const software = selectedSoftware$()
      if (software?.length === 1)
        return software[0].name;

      return this.services.stepLabel$();
    });

    const obs$ = this.modules.selected$
      .pipe(
        map(selected => {
          const exists = this.roles?.$()?.form.getRawValue();

          const form = new FormGroup({
            role: new FormControl(null as unknown as SelectableOption<string>, {
              nonNullable: true,
              validators: [Validators.required]
            }),
            years: createYearControl()
          });
          const status$ = toSignal(controlStatus$(form), { requireSync: true, injector });

          const optionSet = new Set<string>();
          selected.forEach(m => m.roles.forEach(r => optionSet.add(r)));
          const options = [...optionSet]
            .sort(sortString)
            .map<SelectableOption<string>>(o => ({
              selected: false,
              value: o,
              label: o,
            }));

          const roleStatus$ = toSignal(controlStatus$(form.controls.role), { injector });
          const stopInput$ = computed(() => roleStatus$() === 'VALID');

          const handlers = {
            toggle: (option: SelectableOption<string>) => {
              const old = form.controls.role.value;
              form.reset();
              if (old) {
                old.selected = false;

                if (old === option) {
                  form.setValue({
                    role: null as unknown as SelectableOption<string>,
                    years: null as unknown as number
                  });
                  return;
                }
              }

              option.selected = true;
              form.setValue({
                role: option,
                years: null as unknown as number,
              });
            }
          } as const;

          if (exists) {
            const found = exists.role?.value && options.find(o => o.value === exists.role.value);
            if (found) {
              form.setValue({
                role: found,
                years: exists.years
              });
            }
          }

          const selected$ = controlValue$(form, true)
            .pipe(
              map(v => v.role.value),
              shareReplay({ refCount: true, bufferSize: 1 }))

          return {
            form,
            status$,
            selected$,
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

  private initTechExp() {
    this.domains.getTech();

    const stepLabel$ = this.roles.stepLabel$;

    const loadingTech = this.domains.loading.has('tech');
    effect(() => {
      if (loadingTech())
        this.loading.add('technologies');
      else
        this.loading.delete('technologies');
    }, { allowSignalWrites: true });
    const loading$ = this.loading.has('technologies');

    const form = new FormRecord<FormControl<SelectableOption<string>[]>>({});
    const value$ = toSignal(controlValue$(form), { requireSync: true });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    const count$ = computed(() => Object.values(value$()).reduce((p, c) => p + c.length, 0));
    const fullSize$ = computed(() => this.domains.tech$().reduce((p, c) => p + c.items.size, 0));
    const stopInput$ = computed(() => count$() >= fullSize$());

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
      loading$,
      stepLabel$,
      ...handlers
    } as const;
  }

  private initIndustries() {
    this.domains.getIndustries();

    const loadingIndustries = this.domains.loading.has('industries');
    effect(() => {
      if (loadingIndustries())
        this.loading.add('industries');
      else
        this.loading.delete('industries');
    }, { allowSignalWrites: true });
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

    const stepLabel$ = toSignal(this.roles.selected$);

    const form = new FormGroup({
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(1500)]
      })
    });
    const status$ = toSignal(controlStatus$(form), { requireSync: true });

    return {
      form,
      status$,
      stepLabel$
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
    }
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
    }
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
    }
  }

  private async devModeInit() {
    if (!isDevMode())
      return;

    const revert = [] as (() => void)[];

    {
      const { options, toggle } = this.serviceType;
      toggle(options[0]);

      this.stepper.next.click();
    }

    {
      const { options$, toggle, form } = this.primaryDomain;

      const all = await toPromise(options$, all => all.length > 0, this.injector);

      toggle(all[0]);
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
      const { toggle, options, form } = this.software.$()!;

      toggle(options[1]);

      form.patchValue({
        [options[1].value.name]: 3
      });

      this.stepper.next.click();
    }

    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { toggle, options, form } = this.roles.$()!;

      toggle(options[0]);
      form.patchValue({ years: 2 });

      this.stepper.next.click();
    }

    {
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
      const { form } = this.description;
      form.setValue({ description: 'some ai-generated description' });

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

    revert.forEach(r => r());
  }

  ngOnInit(): void {
    this.devModeInit();
  }
}

type Step =
  'service-type' |
  'primary-domain' |
  'services' |
  'modules' |
  'software' |
  'roles' |
  'technology-stack' |
  'industry' |
  'description' |
  'project-type' |
  'required-experience' |
  'weekly-commitment' |
  'engagement-period' |
  'estimated-budget' |
  'starting-period' |
  'remote-work';

function createYearControl(initialValue = null as unknown as number) {
  return new FormControl(
    initialValue,
    {
      validators: [Validators.required, Validators.min(1), Validators.max(30)],
      nonNullable: true
    }
  );
}
