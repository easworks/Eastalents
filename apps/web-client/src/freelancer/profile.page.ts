import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'freelancer-profile-page',
  templateUrl: './profile.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreelancerProfilePageComponent {
  @HostBinding() private readonly class = 'page';
}