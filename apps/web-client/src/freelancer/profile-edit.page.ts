import { ChangeDetectionStrategy, Component, HostBinding, INJECTOR, OnInit, computed, effect, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FormImports, GeoLocationService, ImportsModule, LocationApi, LottiePlayerDirective, generateLoadingState } from '@easworks/app-shell';
import { Country, Province } from '@easworks/models';
import { DateTime } from 'luxon';

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
  private readonly api = {
    location: inject(LocationApi)
  } as const;

  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  private readonly loading = generateLoadingState<[
    'getting profile data' |
    'getting geolocation' |
    'getting countries' |
    'getting provinces' |
    'getting cities' |
    'getting timezone'
  ]>();
  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');
  private readonly section = this.initSection();

  protected readonly professionalSummary = this.initProfessionaSummary();

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
            case 'professional-summary': return step$.set('primary-domains');
          }
        }
      },
      prev: {
        visible$: computed(() => step$() !== 'professional-summary'),
        click: () => {
          switch (step$()) {
            case 'primary-domains': return step$.set('professional-summary');
          }
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

  private initProfessionaSummary() {
    const systemTimeZone = DateTime.now().zoneName;
    const form = new FormGroup({
      summary: new FormControl('', [Validators.required]),
      country: new FormControl<Country>(null as unknown as Country, {
        validators: [Validators.required],
        nonNullable: true
      }),
      province: new FormControl<Province>(null as unknown as Province, {
        validators: [Validators.required],
        nonNullable: true
      }),
      city: new FormControl('', [Validators.required]),
      timezone: new FormControl(systemTimeZone, [Validators.required])
    });

    const loading = {
      geo: this.loading.has('getting geolocation'),
      countries: this.loading.has('getting countries'),
      provinces: this.loading.has('getting provinces'),
      cities: this.loading.has('getting cities'),
      timezone: this.loading.has('getting timezone'),
    };

    const showSpinner = {
      country$: computed(() => loading.geo() || loading.countries()),
      province$: computed(() => loading.geo() || loading.provinces()),
      city$: computed(() => loading.geo() || loading.cities()),
      timezone$: computed(() => loading.geo() || loading.timezone()),
    }

    const validity = {
      country: toSignal(form.controls.country.statusChanges),
      province: toSignal(form.controls.province.statusChanges),
    }

    const values = {
      country: toSignal(form.controls.country.valueChanges),
      province: toSignal(form.controls.province.valueChanges)
    }


    const disabled = {
      country$: computed(() => showSpinner.country$()),
      province$: computed(() => showSpinner.province$() || validity.country() !== 'VALID'),
      city$: computed(() => showSpinner.city$() || validity.province() !== 'VALID'),
      // timezone$: computed(() => showSpinner.timezone$() || validity.country() !== 'VALID'),
    }

    const options = {
      country$: signal<Country[]>([]),
      province$: signal<Province[]>([]),
      city$: signal<string[]>([]),
      timezone$: signal<string[]>([])
    } as const;


    effect(() => {
      const step = this.stepper.step$();
      if (step !== 'professional-summary')
        return;

      const shouldFetch = options.country$().length === 0;
      if (shouldFetch) {
        this.getCountries();
      }
    }, { allowSignalWrites: true });
    effect(() => disabled.country$() ? form.controls.country.disable() : form.controls.country.enable(), { allowSignalWrites: true });
    effect(() => disabled.province$() ? form.controls.province.disable() : form.controls.province.enable(), { allowSignalWrites: true });
    effect(() => disabled.city$() ? form.controls.city.disable() : form.controls.city.enable(), { allowSignalWrites: true });
    // effect(() => disabled.timezone$() ? form.controls.timezone.disable() : form.controls.timezone.enable(), { allowSignalWrites: true });

    effect(() => this.getProvinces(values.country()), { allowSignalWrites: true });
    effect(() => this.getCities(values.country(), values.province()), { allowSignalWrites: true })

    return {
      form,
      loading: {
        showSpinner,
        disabled
      },
      options,
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
    } as const;
  }


  private async devModeInit() {
    if (!isDevMode())
      return;

    const revert = [] as (() => void)[];

    {
      this.stepper.next.click();
    }

    {
      const form = this.professionalSummary.form;
      const keys = Object.keys(form.controls) as (keyof typeof this.professionalSummary.form.controls)[]

      const validators = keys.map(key => [
        key,
        form.controls[key].validator
      ] as const);

      keys.forEach(key => form.controls[key].clearValidators());

      revert.push(() => {
        validators.forEach(([key, validator]) => form.controls[key].validator = validator);
      });

      this.stepper.next.click();
    }

    revert.forEach(r => r());
  }

  private getCountries() {
    this.loading.add('getting countries');

    this.api.location.countries()
      .subscribe({
        next: c => {
          this.professionalSummary.options.country$.set(c);
          this.loading.delete('getting countries');
        },
        error: () => {
          this.loading.delete('getting countries');
        }
      })
  }

  private getProvinces(country: Country | undefined) {
    this.professionalSummary.form.patchValue({
      province: null as unknown as Province,
      city: null,
    });

    if (!country)
      return;

    this.loading.add('getting provinces');
    this.api.location.provinces(country.code)
      .subscribe({
        next: p => {
          this.professionalSummary.options.province$.set(p);
          this.loading.delete('getting provinces');
        },
        error: () => {
          this.loading.delete('getting provinces');
        }
      })
  }

  private getCities(country?: Country, province?: Province) {
    this.professionalSummary.form.patchValue({
      city: null,
    });

    if (!country || !province)
      return;

    this.loading.add('getting cities');
    this.api.location.cities(country.code, province.iso)
      .subscribe({
        next: c => {
          this.professionalSummary.options.city$.set(c);
          this.loading.delete('getting cities');
        },
        error: () => {
          this.loading.delete('getting cities');
        }
      })
  }

  ngOnInit(): void {
    this.devModeInit();
  }
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