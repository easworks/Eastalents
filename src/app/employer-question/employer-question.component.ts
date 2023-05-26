import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Step =
  'start' |
  'enterprise application domain';

@Component({
  selector: 'employer-question',
  templateUrl: './employer-question.component.html',
  styleUrls: ['./employer-question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerQuestionComponent {
  constructor() { }

  readonly step$ = new BehaviorSubject<Step>('start');

  readonly start = {
    next: () => this.step$.next('enterprise application domain')
  } as const;

  readonly entAppDomain = {
    filterString: '',
  };
}