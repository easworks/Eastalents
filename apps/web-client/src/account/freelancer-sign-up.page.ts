import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell';

@Component({
  selector: 'account-freelancer-sign-up-page',
  templateUrl: './freelancer-sign-up.page.html',
  styleUrls: ['./freelancer-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective
  ]
})
export class FreelancerSignUpPageComponent {
  @HostBinding()
  private readonly class = 'page grid lg:flex gap-4 justify-center';
}
