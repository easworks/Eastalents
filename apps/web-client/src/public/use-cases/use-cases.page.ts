import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'use-cases-page',
  templateUrl: './use-cases.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
  ]
})
export class UseCasesPageComponent {


}
