import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoadingState } from 'src/app/_helpers/loading-state';
import { SubscribedDirective } from 'src/app/_helpers/subscribed-directive';

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
      map(s => s !== 'start'),
      shareReplay({ refCount: true, bufferSize: 1 })),
    progress$: this.step$.pipe(
      map(s => {
        switch (s) {
          case 'company info': return 1;
          case 'primary domains': return 2;
          case 'enterprise software': return 3;
          default: return null;
        }
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    ),
    previous: {
      visible$: this.step$.pipe(
        map(s => s !== 'company info'),
        shareReplay({ refCount: true, bufferSize: 1 })),
      click: (currentStep: Step) => {
        switch (currentStep) {
          case 'primary domains': this.step$.next('company info'); break;
          case 'enterprise software': this.step$.next('primary domains'); break;
        }
      }
    },
    next: {
      disabled$: new BehaviorSubject(false),
      click: (currentStep: Step) => {
        switch (currentStep) {
          case 'start': this.step$.next('company info'); break;
          case 'company info': this.step$.next('primary domains'); break;
          case 'primary domains': this.step$.next('enterprise software'); break;
          case 'enterprise software': this.step$.next('end'); break;
        }
      }
    }
  } as const;

  ngOnInit(): void {

  }
}

type LoadingStates = 'getting options data';

type Step =
  'start' |
  'company info' |
  'primary domains' |
  'enterprise software' |
  'end';
