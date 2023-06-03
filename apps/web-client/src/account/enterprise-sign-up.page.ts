import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'account-enterprise-sign-up-page',
  templateUrl: './enterprise-sign-up.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterpriseSignUpPageComponent {
  @HostBinding()
  private readonly class = 'page';
}
