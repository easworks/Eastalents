import { ChangeDetectionStrategy, Component, HostBinding, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { Domain } from '@easworks/app-shell/api/talent.api';
import { controlStatus$ } from '@easworks/app-shell/common/form-field.directive';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { DomainState } from '@easworks/app-shell/state/domains';
import { generateLoadingState } from '@easworks/app-shell/state/loading';
import { SelectableOption } from '@easworks/app-shell/utilities/options';
import { JOB_POST_TYPE_OPTIONS, JobPostType } from '@easworks/models';

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

  @HostBinding() private readonly class = 'page'

  private readonly loading = generateLoadingState<[
    'domains',
  ]>();

  private readonly domains = inject(DomainState);

  protected readonly trackBy = {
    domainOption: (_: number, d: SelectableOption<Domain>) => d.value.key,
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly stepper = this.initStepper();

  protected readonly postType = this.initPostType();
  protected readonly primaryDomain = this.initPrimaryDomain();


  private initStepper() {
    const order: Step[] = [
      'post-type',
      'primary-domain',
      // 'services',
      // 'modules',
      // 'software',
      // 'roles',
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
      options$,
      stopInput$,
      ...handlers
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
