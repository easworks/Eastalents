import { Component, HostBinding } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'admin-page',
  templateUrl: './admin.page.html',
  imports: [
    RouterModule,
    MatTabsModule
  ]
})
export class AdminPageComponent {
  @HostBinding() private readonly class = 'page';

  protected readonly links = [
    { url: '/admin/dashboard', text: 'Dashboard' },
    { url: '/admin/domains', text: 'Domains' },
    { url: '/admin/software-products', text: 'Software Products' },
    { url: '/admin/tech-skills', text: 'Tech Skills' },
    { url: '/admin/tech-groups', text: 'Tech Groups' },
  ];
}