import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'sign-up-account-type-choice-page',
  templateUrl: './sign-up-account-type-choice.page.html',
  imports: [
    RouterModule
  ]
})
export class SignUpAccountTypeChoicePageComponent {

  @HostBinding()
  private readonly class = 'page';

}
