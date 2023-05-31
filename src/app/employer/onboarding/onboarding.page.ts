import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { LoadingState } from 'src/app/_helpers/loading-state';
import { SubscribedDirective } from 'src/app/_helpers/subscribed-directive';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'employer-onboarding-page',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerOnboardingComponent extends SubscribedDirective implements OnInit {
  readonly loading$ = new LoadingState(new Set<LoadingStates>());
  readonly step$ = new BehaviorSubject<Step>('start');

  readonly stepper = {
    totalSteps: 3,
    showControls$: this.step$.pipe(
      map(s => s !== 'start' && s !== 'end'),
      shareReplay({ refCount: true, bufferSize: 1 })),
    progress$: this.step$.pipe(
      map(s => {
        switch (s) {
          case 'organization info': return 1;
          case 'primary domains': return 2;
          case 'enterprise software': return 3;
          default: return null;
        }
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    ),
    previous: {
      visible$: this.step$.pipe(
        map(s => s !== 'organization info'),
        shareReplay({ refCount: true, bufferSize: 1 })),
      click: (currentStep: Step) => {
        switch (currentStep) {
          case 'primary domains': this.step$.next('organization info'); break;
          case 'enterprise software': this.step$.next('primary domains'); break;
        }
      }
    },
    next: {
      disabled$: new BehaviorSubject(false),
      click: (currentStep: Step) => {
        switch (currentStep) {
          case 'start': this.step$.next('organization info'); break;
          case 'organization info': this.step$.next('primary domains'); break;
          case 'primary domains': this.step$.next('enterprise software'); break;
          case 'enterprise software': this.step$.next('end'); break;
        }
      }
    }
  } as const;

  readonly orgInfo = {
    form: new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      summary: new FormControl('', { validators: [Validators.required] }),
      location: new FormControl('', { validators: [Validators.required] }),
      timeZone: new FormControl('', { validators: [Validators.required] }),
      phoneCountryCode: new FormControl('', { validators: [Validators.required] }),
      phoneNumber: new FormControl('', { validators: [Validators.required] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      website: new FormControl('', { validators: [Validators.required] }),
      industryGroup: new FormControl('', { validators: [Validators.required] }),
      industry: new FormControl({ value: '', disabled: true }, { validators: [Validators.required] }),
      category: new FormControl('', { validators: [Validators.required] }),
      employeeCount: new FormControl('', { validators: [Validators.required] })
    })
  };

  private disableNextWhenRequired() {
    combineLatest([
      this.loading$.is$,
      this.step$,
      this.orgInfo.form.statusChanges.pipe(startWith('INVALID'))
    ]).pipe(
      takeUntil(this.destroyed$),
      map(([
        loading,
        step,
        orgInfo
      ]) => {
        if (loading)
          return true;

        switch (step) {
          case 'organization info':
            return orgInfo !== 'VALID';
          default: return false
        }
      })
    ).subscribe(this.stepper.next.disabled$);
  }

  private devModeInit() {
    if (environment.production)
      return;

    this.stepper.next.click('start');
  }

  ngOnInit(): void {

    this.disableNextWhenRequired();

    this.devModeInit();
  }
}

type LoadingStates = 'getting options data';

type Step =
  'start' |
  'organization info' |
  'primary domains' |
  'enterprise software' |
  'end';
