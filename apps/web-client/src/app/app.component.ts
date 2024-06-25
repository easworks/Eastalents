import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, INJECTOR, OnInit, ViewChild, computed, effect, inject, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { NavigationModule } from '@easworks/app-shell/navigation/navigation.module';
import { SWManagementService } from '@easworks/app-shell/services/sw.manager';
import { AuthState } from '@easworks/app-shell/state/auth';
import { MenuItem, NOOP_CLICK, NavMenuState } from '@easworks/app-shell/state/menu';
import { ScreenSize, UI_FEATURE, sidebarActions } from '@easworks/app-shell/state/ui';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faAngleRight, faBars, faCircleArrowUp, } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
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
export class AppComponent implements OnInit {

  private readonly store = inject(Store);
  private readonly menuState = inject(NavMenuState);
  private readonly swm = inject(SWManagementService);
  private readonly auth = inject(AuthState);
  private readonly injector = inject(INJECTOR);
  private readonly dRef = inject(DestroyRef);

  private readonly ui$ = this.store.selectSignal(UI_FEATURE.selectUiState);
  private readonly isSignedIn$ = computed(() => !!this.auth.user$());


  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';

  private readonly appSidenav$ = viewChild.required<MatSidenav>('appSidenav');

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

  protected readonly navigating$ = computed(() => this.ui$().navigating)
  protected readonly sw = {
    hidden$: computed(() => !this.swm.updateAvailable$()),
    updating$: this.swm.updating$,
    update: () => {
      this.swm.wb.messageSkipWaiting();
    }
  } as const;

  private readonly screenSize$ = computed(() => this.ui$().screenSize)

  protected readonly sideBarState = (() => {
    const state$ = this.store.selectSignal(UI_FEATURE.selectSidebar);

    const mode$ = computed(() => {
      if (!this.isSignedIn$())
        return 'over';
      return state$().visible ? 'side' : 'over';
    });
    const opened$ = computed(() => state$().expanded);
    const position$ = computed(() => this.isSignedIn$() ? 'start' : 'end');

    const toggle = (() => {
      const show$ = computed(() => mode$() === 'over');
    
      const position$ = computed(() => {
        if (show$()) {
          return this.isSignedIn$() ? 'left' : 'right';
        }
        return null;
      });
    
      const click = () => this.store.dispatch(sidebarActions.toggleExpansion());
    
      return { position$, click } as const;
    })();

    return { mode$, opened$, position$, toggle} as const;
  })();


  protected readonly showHorizontalMenu$ = computed(() => !this.isSignedIn$() && this.menuState.publicMenu.horizontal$().length > 0);

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
        case 'xs':
        case 'sm':
        case 'md':
        case 'lg':
        case 'xl':
        case '2xl':
          this.menuState.publicMenu.horizontal$.set([]);
          this.menuState.publicMenu.vertical$.set(publicMenu.full());
          break;
        case '3xl':
        case '4xl':
        case '5xl':
          this.menuState.publicMenu.horizontal$.set(publicMenu.firstPart());
          this.menuState.publicMenu.vertical$.set(publicMenu.secondPart());
          break;
        case '6xl':
        case '7xl':
        case '8xl':
        case '9xl':
        case '10xl':
          this.menuState.publicMenu.horizontal$.set(publicMenu.full());
          this.menuState.publicMenu.vertical$.set([]);
          break;
      }
    }, { allowSignalWrites: true, injector: this.injector });

    effect(() => {
      this.navigating$();
      if (untracked(this.sideBarState.mode$) === 'over') {
        this.appSidenav$().close();
      }
    }, { injector: this.injector });
  }
  private updateSidebarIfNeeded() {
    const largeScreenSizes: ScreenSize[] = [ '7xl', '8xl', '9xl', '10xl'];
    const alwaysShowSideMenu$ = computed(() => largeScreenSizes.includes(this.screenSize$()));

    effect(() => {
      if (this.isSignedIn$()) {
        const alwaysShowSideMenu = alwaysShowSideMenu$();

        if (alwaysShowSideMenu) {
          this.store.dispatch(sidebarActions.show());
          this.store.dispatch(sidebarActions.expand());
        }
        else {
          this.store.dispatch(sidebarActions.hide());
          this.store.dispatch(sidebarActions.contract());
        }
      }
      else {
        this.store.dispatch(sidebarActions.hide());
        this.store.dispatch(sidebarActions.contract());
      }

    }, { allowSignalWrites: true, injector: this.injector });

    this.appSidenav$().closedStart
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe(() => {
        this.store.dispatch(sidebarActions.contract());
      });
  }

  ngOnInit() {
    this.updateSidebarIfNeeded();
    this.makeMenuReactive();
  }
}