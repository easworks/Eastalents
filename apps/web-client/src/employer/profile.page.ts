import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'employer-profile-page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerProfilePageComponent { }
