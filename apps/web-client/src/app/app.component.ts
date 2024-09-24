import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, HostBinding, inject, INJECTOR, OnInit, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AuthenticateVerticalMenuComponent } from '@easworks/app-shell/navigation/authenticated-vertical-menu/authenticated-vertical-menu.component';
import { authFeature } from '@easworks/app-shell/state/auth';
import { ScreenSize, sidebarActions, uiFeature } from '@easworks/app-shell/state/ui';
import { Store } from '@ngrx/store';
import { AppFooterComponent } from './footer/footer.component';
import { AppAuthenticatedHeaderComponent } from './header/authenticated/authenticated-header.component';
import { AppPublicHeaderComponent } from './header/public/public-header.component';
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
    PublicSidebarComponent,
    AuthenticateVerticalMenuComponent,
    AppFooterComponent,
    AppPublicHeaderComponent,
    AppAuthenticatedHeaderComponent
  ]
})
export class AppComponent implements OnInit {

  private readonly store = inject(Store);
  private readonly injector = inject(INJECTOR);
  private readonly dRef = inject(DestroyRef);


  private readonly ui$ = this.store.selectSignal(uiFeature.selectUiState);
  private readonly user$ = this.store.selectSignal(authFeature.selectUser);
  protected readonly isSignedIn$ = computed(() => !!this.user$());


  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';

  private readonly appSidenav$ = viewChild.required<MatSidenav>('appSidenav');

  protected readonly navigating$ = computed(() => this.ui$().navigating);

  private readonly screenSize$ = computed(() => this.ui$().screenSize);

  protected readonly sideBarState = (() => {
    const state$ = this.store.selectSignal(uiFeature.selectSidebar);

    const mode$ = computed(() => {
      if (!this.isSignedIn$())
        return 'over';
      return state$().visible ? 'side' : 'over';
    });
    const opened$ = computed(() => state$().expanded);
    const position$ = computed(() => this.isSignedIn$() ? 'start' : 'end');

    return { mode$, opened$, position$ } as const;
  })();


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

  ngOnInit() {
    this.updateSidebarIfNeeded();
  }
}
