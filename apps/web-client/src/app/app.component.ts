import { ChangeDetectionStrategy, Component, HostBinding, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { EventType, Router, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { NavigationModule } from '@easworks/app-shell/navigation/navigation.module';
import { MenuItem, NOOP_CLICK, NavMenuState } from '@easworks/app-shell/state/menu';
import { UiState } from '@easworks/app-shell/state/ui';
import { faAngleRight, faBars, } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook, faGithub, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
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
    faAngleRight,
    faLinkedin,
    faFacebook,
    faGithub,
    faTwitter,
    faInstagram,
    faYoutube
  } as const;

  protected readonly navigating$ = signal(false);
  protected readonly showHorizontalMenu$ = computed(() => this.menuState.publicMenu.horizontal$().length > 0);

  protected readonly footerNav: { group: string, items: MenuItem[]; }[][] = [
    [
      {
        group: 'For Clients',
        items: [
          { name: 'Hire EAS Talents', link: NOOP_CLICK },
          { name: 'Book a Call', link: NOOP_CLICK },
          { name: 'Explore Services', link: NOOP_CLICK },
          { name: 'Hire for specific skills', link: NOOP_CLICK },
          { name: 'FAQ-Client', link: NOOP_CLICK }
        ],
      },
      {
        group: 'For Talents',
        items: [
          { name: 'Apply for Jobs', link: NOOP_CLICK },
          { name: 'Freelancer Login', link: NOOP_CLICK },
          { name: 'FAQ -Talent', link: NOOP_CLICK },
        ],
      },
  ],
    [
      {
        group: 'Use cases',
        items: [
          { name: 'Digital Transformation (DX)', link: NOOP_CLICK },
          { name: 'Prototyping', link: NOOP_CLICK },
          { name: 'Enterprise Application Design', link: NOOP_CLICK },
          { name: 'Business Intelligence', link: NOOP_CLICK },
          { name: 'Application Modernization', link: NOOP_CLICK },
          { name: 'Enterprise Application Integration', link: NOOP_CLICK },
          { name: 'Custom Enterprise Application', link: NOOP_CLICK },
          { name: 'Enterprise Application Testing', link: NOOP_CLICK },
          { name: 'Data Migration', link: NOOP_CLICK },
          { name: 'Support & Maintenance', link: NOOP_CLICK },
        ]
      },
    ],
    [
      {
        group: 'Industries',
        items: [
          { name: 'Automotive', link: NOOP_CLICK },
          { name: 'Aerospace and Defense', link: NOOP_CLICK },
          { name: 'Retail and E-commerce', link: NOOP_CLICK },
          { name: 'Manufacturing', link: NOOP_CLICK },
          { name: 'Retail and E-commerce', link: NOOP_CLICK },
          { name: 'Healthcare', link: NOOP_CLICK },
          { name: 'Financial Services', link: NOOP_CLICK },
          { name: 'Electronics and High Tech', link: NOOP_CLICK },
          { name: 'Consumer Packaged Goods', link: NOOP_CLICK },
          { name: 'Pharmaceuticals', link: NOOP_CLICK },
        ]
      },
    ],
    [
      {
        group: 'About',
        items: [
          { name: 'About us', link: NOOP_CLICK },
          { name: 'Blog', link: NOOP_CLICK },
          { name: 'Careers', link: NOOP_CLICK },
          { name: 'Community', link: NOOP_CLICK },
          { name: 'Code of Conduct', link: NOOP_CLICK },
        ]
      },
      {
        group: 'Contact Us',
        items: [
          { name: 'Contact Us', link: NOOP_CLICK },
          { name: 'Help Center', link: NOOP_CLICK },
        ],
      },
    ],
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