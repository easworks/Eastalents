import { Component, HostBinding } from '@angular/core';
import { TalentSignUpCardsComponent } from './talent/cards/talent-sign-up-cards.component';
import { EmployerSignUpCardsComponent } from './employer/cards/employer-sign-up-cards.component';

@Component({
  standalone: true,
  template: `
  <talent-sign-up-cards></talent-sign-up-cards>
  <employer-sign-up-cards></employer-sign-up-cards>
  `,
  selector: 'demo-page',
  imports: [
    TalentSignUpCardsComponent,
    EmployerSignUpCardsComponent
  ]
})
export class DemoPageComponent {

  @HostBinding() private readonly class = 'block w-full max-w-xl ml-auto bg-slate-200';

}