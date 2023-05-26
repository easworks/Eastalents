import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Step = 'start';

@Component({
  selector: 'employer-question',
  templateUrl: './employer-question.component.html',
  styleUrls: ['./employer-question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerQuestionComponent {
  constructor() { }

  readonly step$ = new BehaviorSubject<Step>('start');

}