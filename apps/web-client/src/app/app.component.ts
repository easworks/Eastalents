import { ChangeDetectionStrategy, Component, HostBinding, computed, effect, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EventType, Router, RouterModule } from '@angular/router';
import { ImportsModule, MenuItem, NOOP_CLICK, NavMenuState, NavigationModule, UiState } from '@easworks/app-shell';
import { publicMenu } from './menu-items';
import { AccountWidgetComponent } from '../account/account.widget';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'easworks-web-client-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule,
    MatSidenavModule,

    NavigationModule,
    AccountWidgetComponent
  ]
})
export class AppComponent {
  constructor() {
    this.processRouterEvents();
    this.makeMenuReactive();
  }

  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';
  private readonly uiState = inject(UiState);
  private readonly menuState = inject(NavMenuState);

  protected readonly navigating$ = signal(false);
  protected readonly showHorizontalMenu$ = computed(() => this.menuState.publicMenu.horizontal$().length > 0);

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

  private makeMenuReactive() {
    effect(() => {
      const screenSize = this.uiState.screenSize$();

      switch (screenSize) {
        case 'sm':
        case 'md':
          this.menuState.publicMenu.horizontal$.set([]);
          this.menuState.publicMenu.vertical$.set(publicMenu.full());
          break;
        case 'lg':
          this.menuState.publicMenu.horizontal$.set(publicMenu.firstPart());
          this.menuState.publicMenu.vertical$.set(publicMenu.secondPart());
          break;
        case 'xl':
          this.menuState.publicMenu.horizontal$.set(publicMenu.full());
          this.menuState.publicMenu.vertical$.set([]);
      }
    }, { allowSignalWrites: true })
  }

  private processRouterEvents() {
    const router = inject(Router);

    router.events.pipe(takeUntilDestroyed()).subscribe(
      event => {
        switch (event.type) {
          case EventType.NavigationStart: {
            this.navigating$.set(true);
          } break;
          case EventType.NavigationEnd:
          case EventType.NavigationCancel:
          case EventType.NavigationError: {
            this.navigating$.set(false);
          } break;
        }
      }
    )
  }
}