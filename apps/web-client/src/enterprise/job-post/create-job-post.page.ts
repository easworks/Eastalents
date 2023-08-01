import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { Domain, DomainModule, DomainProduct } from '@easworks/app-shell/api/talent.api';
import { controlStatus$, controlValue$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { JOB_POST_TYPE_OPTIONS, JobPostType } from '@easworks/models';
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
    FormImportsModule
  ]
})
export class CreateJobPostPageComponent implements OnInit {
  private readonly injector = inject(INJECTOR);
  private readonly domains = inject(DomainState);

  @HostBinding() private readonly class = 'page'

  private readonly loading = generateLoadingState<[
    'domains',
  ]>();


  protected readonly trackBy = {
    domainOption: (_: number, d: SelectableOption<Domain>) => d.value.key,
    moduleOption: (_: number, m: SelectableOption<DomainModule>) => m.value.name,
    softwareOption: (_: number, s: SelectableOption<DomainProduct>) => s.value.name,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly stepper = this.initStepper();

  protected readonly postType = this.initPostType();
  protected readonly primaryDomain = this.initPrimaryDomain();
  protected readonly services = this.initServices();
  protected readonly modules = this.initModules();
  protected readonly software = this.initSoftware();


  private initStepper() {
    const order: Step[] = [
      'post-type',
      'primary-domain',
      'services',
      'modules',
      'software',
      'roles',
      // 'technology-stack',
      // 'industry',
      // 'description',
      // 'project-type',
      // 'experience',
      // 'estimated-hours',
      // 'engagement-period',
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
      (step === 'post-type' && this.postType.status$() === 'VALID') ||
      (step === 'primary-domain' && this.primaryDomain.status$() === 'VALID') ||
      (step === 'services' && this.services.$()?.status$() === 'VALID') ||
      (step === 'modules' && this.modules.$()?.status$() === 'VALID') ||
      (step === 'software' && this.software.$()?.status$() === 'VALID') ||
      false;

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

  private initPostType() {
    const form = new FormControl(null as unknown as SelectableOption<JobPostType>, {
      validators: [Validators.required]
    });

    const options = JOB_POST_TYPE_OPTIONS
      .map<SelectableOption<JobPostType>>(t => ({
        selected: false,
        value: t,
        label: t
      }));

    const handlers = {
      toggle: (option: SelectableOption<JobPostType>) => {
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

          return {
            form,
            status$,
            count$,
            stopInput$,
            options,
            ...handlers
          } as const;
        }),
        shareReplay({ refCount: true, bufferSize: 1 }));

    const $ = toSignal(obs$);

    return {
      $,
      stepLabel$
    } as const;

  }

  private async devModeInit() {
    if (!isDevMode())
      return;

    const revert = [] as (() => void)[];

    {
      const { options, toggle } = this.postType;
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

      toggle(options[0]);
      toggle(options[1]);

      form.patchValue({
        [options[0].value.name]: 2,
        [options[1].value.name]: 3
      });

      this.stepper.next.click();
    }

    revert.forEach(r => r());
  }

  ngOnInit(): void {
    this.devModeInit();
  }
}

type Step =
  'post-type' |
  'primary-domain' |
  'services' |
  'modules' |
  'software' |
  'roles' |
  'technology-stack' |
  'industry' |
  'description' |
  'project-type' |
  'experience' |
  'estimated-hours' |
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
