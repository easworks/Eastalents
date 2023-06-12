import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormImports, GeoLocationService, ImportsModule, LottiePlayerDirective, generateLoadingState } from '@easworks/app-shell';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ]
})
export class FreelancerProfileEditPageComponent implements OnInit {
  private readonly injector = inject(INJECTOR);
  private readonly route = inject(ActivatedRoute);
  private readonly geo = inject(GeoLocationService);

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  private readonly loading = generateLoadingState<[
    'getting profile data' |
    'getting geolocation' |
    'getting countries' |
    'getting states' |
    'getting cities' |
    'getting timezone'
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly section = this.initSection();


  protected readonly professionalSummary = {
    form: new FormGroup({
      summary: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      timezone: new FormControl('', [Validators.required])
    }),
    loading: {
      geo$: this.loading.has('getting geolocation'),
      countries$: this.loading.has('getting countries'),
      states$: this.loading.has('getting states'),
      cities$: this.loading.has('getting states'),
      timezone$: this.loading.has('getting timezone')
    },
    useCurrentLocation: async () => {
      const pos = await this.geo.get();

      // now that we have gotten the coords
      // or gotten null
      // we have to send these off to the api to
      // figure out where the user is
      // then populate the form with those values

      throw new Error('not implemented');

    }
  } as const;

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
        case 'professional-summary': return 1;
        default: return 0;
      }
    });


    const inputs = {
      summary: toSignal(this.professionalSummary.form.statusChanges)
    } as const;

    const nextDisabled$ = computed(() => {
      const step = step$();
      return this.loading.any$() ||
        (step === 'professional-summary' && inputs.summary() !== 'VALID');
    });

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
        disabled$: nextDisabled$,
        click: () => {
          switch (step$()) {
            case 'start': return step$.set('professional-summary');
          }
        }
      },
      prev: {
        visible$: computed(() => step$() !== 'professional-summary'),
        click: () => {
          // 
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

  private async devModeInit() {
    if (!isDevMode())
      return;

    {
      this.stepper.next.click();
    }
  }

  ngOnInit(): void {
    this.devModeInit();
  }
}

type Step =
  'start' |
  'professional-summary' |
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