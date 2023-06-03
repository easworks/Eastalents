import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, computed, inject } from '@angular/core';
import { MenuItem, NOOP_CLICK, NavMenuState } from './state';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppVerticalMenuComponent {

  @HostBinding()
  private readonly class = 'grid gap-4 p-4 w-80';
  private readonly menuState = inject(NavMenuState);
  private readonly hostElement = inject(ElementRef).nativeElement as HTMLElement;

  protected readonly publicMenu = {
    show$: computed(() => this.menuState.publicMenu.vertical$().length > 0),
    items: this.menuState.publicMenu.vertical$,
  } as const;

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
  ];

  toggleOpen($event: MouseEvent) {
    const target = $event.target as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parent = target.parentElement!;
    const shouldAdd = !parent.classList.contains('open');

    if (shouldAdd) {
      parent.classList.add('open');
    }
    else {
      parent.classList.remove('open');
    }
  }
}