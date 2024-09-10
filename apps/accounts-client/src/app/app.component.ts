import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, HostBinding, inject, INJECTOR, OnInit, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { ScreenSize, sidebarActions, uiFeature } from '@easworks/app-shell/state/ui';
import { Store } from '@ngrx/store';
import { AppHeaderComponent } from './header/app-header.component';
import { SplashComponent } from './splash/splash.component';

@Component({
  standalone: true,
  selector: 'easworks-accounts-client-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule,
    AppHeaderComponent,
    MatSidenavModule,
    SplashComponent
  ]
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly injector = inject(INJECTOR);
  private readonly dRef = inject(DestroyRef);


  @HostBinding()
  private readonly class = 'flex flex-col min-h-screen';

  private readonly appSidenav$ = viewChild.required<MatSidenav>('appSidenav');

  private readonly ui$ = this.store.selectSignal(uiFeature.selectUiState);

  protected readonly navigating$ = computed(() => this.ui$().navigating);
  private readonly screenSize$ = computed(() => this.ui$().screenSize);
  protected readonly minimalUi$ = computed(() => this.ui$().minimalUi);
  protected readonly showSplashScreen$ = computed(() => this.ui$().showSplashScreen);

  protected readonly sideBarState = (() => {
    const state$ = this.store.selectSignal(uiFeature.selectSidebar);

    const mode$ = computed(() => {
      return state$().visible ? 'side' : 'over';
    });
    const opened$ = computed(() => state$().expanded);

    return { mode$, opened$ } as const;
  })();

  private updateSidebarIfNeeded() {
    const largeScreenSizes: ScreenSize[] = ['7xl', '8xl', '9xl', '10xl'];
    const alwaysShowSideMenu$ = computed(() => largeScreenSizes.includes(this.screenSize$()));

    effect(() => {
      const alwaysShowSideMenu = alwaysShowSideMenu$();

      if (this.minimalUi$()) {
        this.store.dispatch(sidebarActions.hide());
        this.store.dispatch(sidebarActions.contract());
      }
      else {
        if (alwaysShowSideMenu) {
          this.store.dispatch(sidebarActions.show());
          this.store.dispatch(sidebarActions.expand());
        }
        else {
          this.store.dispatch(sidebarActions.hide());
          this.store.dispatch(sidebarActions.contract());
        }
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
