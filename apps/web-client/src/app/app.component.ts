import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, computed, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MenuItem, NOOP_CLICK, NavMenuState, NavigationModule } from 'app-shell';

@Component({
  standalone: true,
  selector: 'easworks-web-client-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatRippleModule,
    MatDividerModule,

    NavigationModule
  ]
})
export class AppComponent {
  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';

  private readonly menuState = inject(NavMenuState);
  protected readonly showHorizontalMenu$ = computed(() => this.menuState.mode$() === 'horizontal')

  protected readonly footerNav: { group: string, items: MenuItem[] }[] = [
    {
      group: 'Customers',
      items: [
        { name: 'Hire Developers', link: NOOP_CLICK },
        { name: 'Book a Call', link: NOOP_CLICK },
        { name: 'Hire for specific skills', link: NOOP_CLICK }
      ]
    },
    {
      group: 'Get Hired',
      items: [
        { name: 'Apply for Jobs', link: NOOP_CLICK },
        { name: 'Freelancer Login', link: NOOP_CLICK },
        { name: 'Apply for specific skills', link: NOOP_CLICK },
      ]
    },
    {
      group: 'Contact',
      items: [
        { name: 'Blog', link: NOOP_CLICK },
        { name: 'Contact Us', link: NOOP_CLICK },
        { name: 'Help Center', link: NOOP_CLICK },
      ]
    }
  ];
}
