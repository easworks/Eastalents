import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'organization-dashboard-page',
  templateUrl: './dashboard.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationDashboardComponent { }