import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'freelancer-profile-page',
  templateUrl: './profile.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreelancerProfilePageComponent { }