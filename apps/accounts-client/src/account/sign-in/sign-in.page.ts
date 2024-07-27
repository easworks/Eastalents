import { Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  selector: 'sign-in-page',
  templateUrl: './sign-in.page.html',
})
export class SignInPageComponent {
  @HostBinding()
  private readonly class = 'page grid place-content-center';
}