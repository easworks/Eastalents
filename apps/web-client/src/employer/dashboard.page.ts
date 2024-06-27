import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'freelancer-dashboard-page',
  templateUrl: './dashboard.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployerDashboardComponent { }