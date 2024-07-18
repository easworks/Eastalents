import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, HostBinding, inject, INJECTOR, OnInit, signal, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthenticateVerticalMenuComponent } from '@easworks/app-shell/navigation/authenticated-vertical-menu/authenticated-vertical-menu.component';
import { MenuItem } from '@easworks/app-shell/navigation/models';
import { authFeature } from '@easworks/app-shell/state/auth';
import { ScreenSize, sidebarActions, UI_FEATURE } from '@easworks/app-shell/state/ui';
import { isServer } from '@easworks/app-shell/utilities/platform-type';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AppFooterComponent } from './footer/footer.component';
import { AppAuthenticatedHeaderComponent } from './header/authenticated/authenticated-header.component';
import { AppPublicHeaderComponent } from './header/public/public-header.component';
import { footerNav, publicMenu } from './menu-items/public';
import { PublicSidebarComponent } from './sidebar/public/public-sidebar.component';

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
    AppHorizontalMenuComponent,
    PublicVerticalMenuComponent,
    AuthenticateVerticalMenuComponent,
    AccountWidgetComponent,
    AppFooterComponent,
    AppPublicHeaderComponent,
    AppAuthenticatedHeaderComponent
  ]
})
export class AppComponent implements OnInit {

  private readonly store = inject(Store);
  private readonly swm = inject(SWManagementService);
  private readonly injector = inject(INJECTOR);
  private readonly dRef = inject(DestroyRef);

  private readonly ui$ = this.store.selectSignal(UI_FEATURE.selectUiState);
  private readonly user$ = this.store.selectSignal(authFeature.selectUser);
  protected readonly isSignedIn$ = computed(() => !!this.user$());


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

  protected readonly navigating$ = computed(() => this.ui$().navigating);
  protected readonly sw = {
    hidden$: computed(() => !this.swm.updateAvailable$()),
    updating$: this.swm.updating$,
    update: () => {
      this.swm.wb.messageSkipWaiting();
    }
  } as const;

  private readonly screenSize$ = computed(() => this.ui$().screenSize);

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

    return { mode$, opened$, position$, toggle } as const;
  })();

  protected readonly publicMenu = (() => {

    const main = (() => {
      // where the public menu will split between horizontal and vertical
      // items before the split is
      const split$ = computed(() => {
        const screenSize = this.ui$().screenSize;

        switch (screenSize) {
          case 'xs':
          case 'sm':
          case 'md':
          case 'lg':
          case 'xl':
          case '2xl': return 'vertical';
          case '3xl':
          case '4xl':
          case '5xl': return 3;
          case '6xl':
          case '7xl':
          case '8xl':
          case '9xl':
          case '10xl': return 'horizontal';
        }
      });

      const items$ = computed(() => {
        let vertical: MenuItem[] = [];
        let horizontal: MenuItem[] = [];

        if (!this.isSignedIn$()) {
          const split = split$();

          if (split === 'horizontal') {
            vertical = [];
            horizontal = publicMenu.main;
          }
          else if (split === 'vertical') {
            vertical = publicMenu.main;
            horizontal = [];
          }
          else {
            vertical = publicMenu.main.slice(split);
            horizontal = publicMenu.main.slice(0, split);
          }
        }

        return { vertical, horizontal } as const;
      });

      const horizontal = (() => {
        const $ = computed(() => items$().horizontal);
        const show$ = computed(() => $().length > 0);
        return { $, show$ } as const;
      })();

      const vertical = (() => {
        const $ = computed(() => items$().vertical);
        return { $ } as const;
      })();

      return { horizontal, vertical } as const;
    })();

    return {
      ...publicMenu,
      main
    } as const;

  })();

  protected readonly topBar$ = computed(() => {
    const dark = this.ui$().topBar.dark;
    return {
      brandImage: dark ? '/assets/brand/logo-full-light.png' : '/assets/brand/logo-full-dark.png',
      dark
    } as const;
  });

  protected readonly social = publicMenu.social;

  protected readonly footerNav = footerNav;

  private updateSidebarIfNeeded() {
    const largeScreenSizes: ScreenSize[] = ['7xl', '8xl', '9xl', '10xl'];
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

    effect(() => {
      this.navigating$();
      if (untracked(this.sideBarState.mode$) === 'over') {
        this.appSidenav$().close();
      }
    }, { injector: this.injector });
  }

  private serveBlankPage() {
    if (!this.isServer)
      return;

    const route = this.injector.get(ActivatedRoute);

    route.queryParamMap
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe(params => {
        if (params.has('__blank_page')) {
          this.blankPage$.set(true);
        }
      });
  }

  ngOnInit() {
    this.updateSidebarIfNeeded();
    this.serveBlankPage();
  }
}
