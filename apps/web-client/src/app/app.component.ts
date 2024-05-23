import { ChangeDetectionStrategy, Component, HostBinding, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { EventType, Router, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { NavigationModule } from '@easworks/app-shell/navigation/navigation.module';
import { SWManagementService } from '@easworks/app-shell/services/sw.manager';
import { MenuItem, NOOP_CLICK, NavMenuState } from '@easworks/app-shell/state/menu';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faAngleRight, faBars, faCircleArrowUp, } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AccountWidgetComponent } from '../account/account.widget';
import { publicMenu, socialIcons } from './menu-items';

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

    this.menuState.brandLinks$.set(socialIcons);
  }

  private readonly store = inject(Store);
  private readonly menuState = inject(NavMenuState);
  private readonly swm = inject(SWManagementService);

  private readonly ui$ = this.store.selectSignal(UI_FEATURE.selectUiState);

  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';

  @ViewChild('appSidenav', { static: true }) private readonly appSideNav!: MatSidenav;

  protected readonly icons = {
    faBars,
    faCircleArrowUp,
    faAngleRight,
    faLinkedin,
    faFacebook,
    faGithub,
    faTwitter,
    faInstagram,
    faYoutube
  } as const;

  protected readonly navigating$ = signal(false);
  protected readonly sw = {
    hidden$: computed(() => !this.swm.updateAvailable$()),
    updating$: this.swm.updating$,
    update: () => {
      this.swm.wb.messageSkipWaiting();
    }
  } as const;

  protected readonly showHorizontalMenu$ = computed(() => this.menuState.publicMenu.horizontal$().length > 0);

  protected readonly topBar$ = computed(() => {
    const dark = this.ui$().topBar.dark;
    return {
      brandImage: dark ? '/assets/brand/logo-full-light.png' : '/assets/brand/logo-full-dark.png',
      dark
    } as const;
  });

  protected readonly footerNav = {
    companies: {
      group: 'For Companies',
      items: [
        { name: 'Hire EAS Talents', link: NOOP_CLICK },
        { name: 'Book a Call', link: NOOP_CLICK },
        { name: 'Explore Services', link: NOOP_CLICK },
        { name: 'Hire for specific skills', link: NOOP_CLICK },
        { name: 'FAQ-Client', link: NOOP_CLICK }
      ],
    },
    freelancers: {
      group: 'For Talents',
      items: [
        { name: 'Apply for Jobs', link: NOOP_CLICK },
        { name: 'Freelancer Login', link: NOOP_CLICK },
        { name: 'FAQ -Talent', link: NOOP_CLICK },
      ],
    },
    useCase: {
      group: 'Use cases',
      items: publicMenu.items.useCases.children,
    },
    industries: {
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
      ],
    },
    about: {
      group: 'About',
      items: [
        publicMenu.items.aboutUs,
        { name: 'Blog', link: NOOP_CLICK },
        { name: 'Careers', link: NOOP_CLICK },
        { name: 'Community', link: NOOP_CLICK },
        publicMenu.items.codeOfConduct,
        publicMenu.items.dataProcessingAgreement
      ],
    },
    contact: {
      group: 'Contact Us',
      items: [
        publicMenu.items.contactUs,
        publicMenu.items.helpCenter
      ],
    }
  } satisfies {
    [key: string]: {
      group: string,
      items: MenuItem[];
    };
  };

  protected readonly brandLinks$ = this.menuState.brandLinks$;

  private makeMenuReactive() {
    effect(() => {
      const screenSize = this.ui$().screenSize;

      switch (screenSize) {
        case 'sm':
        case 'md':
          this.menuState.publicMenu.horizontal$.set([]);
          this.menuState.publicMenu.vertical$.set(publicMenu.full());
          break;
        case 'lg':
        case 'xl':
          // this.menuState.publicMenu.horizontal$.set(publicMenu.firstPart());
          // this.menuState.publicMenu.vertical$.set(publicMenu.secondPart());
          // break;
          this.menuState.publicMenu.horizontal$.set(publicMenu.full());
          this.menuState.publicMenu.vertical$.set([]);
          break;
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