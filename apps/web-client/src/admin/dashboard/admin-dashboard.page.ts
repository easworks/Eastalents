import { Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.page.html'
})
export default class AdminDashboardPageComponent {
  @HostBinding() private readonly class = 'page';
}