import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'account-freelancer-sign-up-page',
  templateUrl: './freelancer-sign-up.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreelancerSignUpPageComponent {
  @HostBinding()
  private readonly class = 'page';
}
