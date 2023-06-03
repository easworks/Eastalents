import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'account-sign-in-page',
  templateUrl: './sign-in.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSignInPageComponent {
  @HostBinding()
  private readonly class = 'page';
}