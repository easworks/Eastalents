import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem, NOOP_CLICK } from './state';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppVerticalMenuComponent {
  protected readonly menuItems: MenuItem[] = [
    { name: 'Hire Talent', link: NOOP_CLICK },
    { name: 'For Enterprises', link: NOOP_CLICK },
    { name: 'Join EASWORKS', link: NOOP_CLICK },
    { name: 'For Freelancers', link: NOOP_CLICK },
  ];

  protected readonly brandLinks: MenuItem[] = [
    { name: 'twitter', icon: 'twitter', link: NOOP_CLICK },
    { name: 'facebook', icon: 'facebook', link: NOOP_CLICK },
    { name: 'instagram', icon: 'instagram', link: NOOP_CLICK },
    { name: 'pinterest', icon: 'pinterest', link: NOOP_CLICK },
    { name: 'youtube', icon: 'youtube', link: NOOP_CLICK },
  ]
}