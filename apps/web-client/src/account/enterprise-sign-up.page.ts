import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'account-enterprise-sign-up-page',
  templateUrl: './enterprise-sign-up.page.html',
  styleUrls: ['./enterprise-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class EnterpriseSignUpPageComponent {
  @HostBinding()
  private readonly class = 'page grid lg:flex gap-4 justify-center flex-row-reverse';
}
