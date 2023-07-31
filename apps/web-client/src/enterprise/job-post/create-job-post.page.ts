import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { controlStatus$ } from '@easworks/app-shell/common/form-field.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
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
    MatPseudoCheckboxModule
  ]
})
export class CreateJobPostPageComponent {

  @HostBinding() private readonly class = 'page'

  private readonly loading = generateLoadingState<[
    'domains',
  ]>();

  protected readonly trackBy = {
    stringOption: (_: number, s: SelectableOption<string>) => s.value,
  } as const;

  protected readonly displayWith = {
    checkbox: (value: boolean) => value ? 'checked' : 'unchecked'
  } as const;

  protected readonly stepper = this.initStepper();

  protected readonly postType = this.initPostType();


  private initStepper() {
    const order: Step[] = [
      'post-type',
      'primary-domain',
      'services',
      'modules',
      'software',
      'roles',
      'technology-stack',
      'industry',
      'description',
      'project-type',
      'experience',
      'estimated-hours',
      'engagement-period',
      'estimated-budget',
      'starting-period',
      'remote-work'
    ];
    const stepNumbers = order.reduce((prev, cv, ci) => {
      prev[cv] = ci + 1;
      return prev;
    }, {} as Record<Step, number>);

    const step$ = signal<Step>(order[0]);

    const totalSteps = order.length;
    const stepIndex$ = computed(() => stepNumbers[step$()]);
    const progress$ = computed(() => {
      const s = stepIndex$();
      return {
        label: `Step ${s} of ${totalSteps}`,
        percent: ((s - 1) / totalSteps) * 100
      }
    });

    const firstStep = order[1];
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