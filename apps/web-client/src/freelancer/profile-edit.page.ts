import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule, LottiePlayerDirective, generateLoadingState } from '@easworks/app-shell';

@Component({
  selector: 'freelancer-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective
  ]
})
export class FreelancerProfileEditPageComponent {

  private readonly route = inject(ActivatedRoute);

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  private readonly loading = generateLoadingState<[
    'getting profile data'
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly section = this.initSection();
  protected readonly stepper = this.initStepper();

  private initStepper() {
    const step$ = signal<Step>(this.section ?? 'start');

    const showStepControls$ = computed(() => {
      if (this.section)
        return false;

      const step = step$();
      return step !== 'start' && step !== 'end';
    });


    const totalSteps = 1;
    const stepProgress$ = computed(() => {
      switch (step$()) {
        default: return 0;
      }
    });

    return {
      totalSteps,
      step$,
      showStepControls$,
      progress$: computed(() => {
        const p = stepProgress$();
        return {
          label: `Step ${p} of ${totalSteps}`,
          percent: (p / totalSteps) * 100
        }
      })
    } as const;
  }

  private initSection() {
    if (this.isNew)
      return null;

    const param = this.route.snapshot.queryParamMap.get('section');
    const allowed: Step[] = [];

    return allowed.find(i => i === param) ?? null;
  }
}

type Step =
  'start' |
  'end';