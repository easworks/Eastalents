import { ChangeDetectionStrategy, Component, HostBinding, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { EventType, Router, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { NavigationModule } from '@easworks/app-shell/navigation/navigation.module';
import { MenuItem, NOOP_CLICK, NavMenuState } from '@easworks/app-shell/state/menu';
import { UiState } from '@easworks/app-shell/state/ui';
import { faAngleRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { AccountWidgetComponent } from '../account/account.widget';
import { publicMenu } from './menu-items';

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
  @ViewChild('appSidenav', { static: true }) private readonly appSideNav!: MatSidenav;

  protected readonly icons = {
    faBars,
    faAngleRight
  } as const;

  protected readonly navigating$ = signal(false);
  protected readonly showHorizontalMenu$ = computed(() => this.menuState.publicMenu.horizontal$().length > 0);

  protected readonly footerNav: { group: string, items: MenuItem[]; }[] = [
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
    }, { allowSignalWrites: true });

    effect(() => {
      this.navigating$();
      this.appSideNav.close();
    });
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
    );
  }
}