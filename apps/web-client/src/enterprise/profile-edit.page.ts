import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'enterprise-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterpriseProfileEditPageComponent { }