import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  imports: [ImportsModule, RouterModule]
})
export default class AdminDashboardPageComponent {
  @HostBinding() private readonly class = 'page';
}