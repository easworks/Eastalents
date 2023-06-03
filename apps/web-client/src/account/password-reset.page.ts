import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'account-password-reset-page',
  templateUrl: './password-reset.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPasswordResetPageComponent {
  @HostBinding()
  private readonly class = 'page';
}