import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'account-registration-choice-page',
  templateUrl: './sign-up-choice.page.html',
  imports: [
    RouterModule
  ]
})
export class AccountRegistrationTypeChoicePageComponent {

  @HostBinding()
  private readonly class = 'page';

}
