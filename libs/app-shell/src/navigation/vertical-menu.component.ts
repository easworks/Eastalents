import { ChangeDetectionStrategy, Component, HostBinding, computed, inject } from '@angular/core';
import { MenuItem, NOOP_CLICK } from './state';
import { NavMenuState } from './state';

@Component({
  selector: 'nav[vertical-menu]',
  templateUrl: './vertical-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppVerticalMenuComponent {

  @HostBinding()
  private readonly class = 'grid gap-4 p-4';

  private readonly menuState = inject(NavMenuState);
  protected readonly isVertical$ = computed(() => this.menuState.mode$() === 'vertical')

  protected readonly staticMenuItems: MenuItem[] = [
    { name: 'Hire Talent', link: NOOP_CLICK },
    { name: 'For Enterprises', link: NOOP_CLICK },
    { name: 'Join EASWORKS', link: NOOP_CLICK },
    { name: 'For Freelancers', link: NOOP_CLICK },
  ];

  protected readonly aboutMenuItems: MenuItem[] = [
    { name: 'Resources', link: NOOP_CLICK },
    { name: 'Blog', link: NOOP_CLICK },
    { name: 'Press Center', link: NOOP_CLICK },
    { name: 'About Andela', link: NOOP_CLICK },
    { name: 'Careers', link: NOOP_CLICK },
  ];

  protected readonly brandLinks: MenuItem[] = [
    { name: 'twitter', icon: 'twitter', link: NOOP_CLICK },
    { name: 'facebook', icon: 'facebook', link: NOOP_CLICK },
    { name: 'instagram', icon: 'instagram', link: NOOP_CLICK },
    { name: 'pinterest', icon: 'pinterest', link: NOOP_CLICK },
    { name: 'youtube', icon: 'youtube', link: NOOP_CLICK },
  ]
}