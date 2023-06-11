import { ChangeDetectionStrategy, Component, HostBinding, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  protected readonly profileSummary = {
    form: new FormGroup({
      summary: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required])
    })
  } as const;

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
        case 'summary': return 1;
        default: return 0;
      }
    });

    const nextDisabled$ = signal(true);

    return {
      totalSteps,
      step$,
      showStepControls$,
      progress$: computed(() => {
        const p = stepProgress$();
        return {
          label: `Step ${p} of ${totalSteps}`,
          percent: ((p - 1) / totalSteps) * 100
        }
      }),
      next: {
        visible$: computed(() => step$() !== 'social'),
        disabled$: nextDisabled$.asReadonly(),
        click: () => {
          switch (step$()) {
            case 'start': return step$.set('summary');
          }
        }
      },
      prev: {
        visible$: computed(() => step$() !== 'summary'),
        click: () => {
          // 
        }
      },
      submit: {
        disabled$: nextDisabled$.asReadonly(),
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
}

type Step =
  'start' |
  'summary' |
  'primary-domain' |
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