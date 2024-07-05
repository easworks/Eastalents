import { ViewportScroller } from '@angular/common';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { AuthService } from '@easworks/app-shell/services/auth';
import { DefaultSeoConfig, SEOService, SEO_DEFAULT_CONFIG } from '@easworks/app-shell/services/seo';
import { SWManagementService, SW_URL } from '@easworks/app-shell/services/sw.manager';
import { authFeature } from '@easworks/app-shell/state/auth';
import { authEffects } from '@easworks/app-shell/state/auth.effects';
import { navMenuFeature } from '@easworks/app-shell/state/nav-menu';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';
import { uiEffects } from '@easworks/app-shell/state/ui.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { signInEffects } from '../account/sign-in.effects';
import { adminData } from '../admin/state/admin-data';
import { adminDataEffects } from '../admin/state/admin-data.effects';
import { serviceWorkerUrl } from '../service-worker/sw.loader';
import { provideEnvironment } from './environment';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideStore(),
    provideStoreDevtools({
      name: 'Easworks',
      logOnly: true
    }),
    provideAnimations(),
    {
      provide: APP_INITIALIZER, multi: true,
      deps: [ViewportScroller],
      useFactory: (vs: ViewportScroller) => () => {
        vs.setOffset([0, 80]);
      }
    },
    provideRouter(routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideEnvironment(),
    {
      provide: SEO_DEFAULT_CONFIG, useValue: {
        baseTitle: 'EasWorks',
        defaultDescription: 'EasWorks'
      } satisfies DefaultSeoConfig
    },
    importProvidersFrom([
      MatSnackBarModule,
      MatDialogModule
    ]),
    { provide: SW_URL, useValue: serviceWorkerUrl },
    {
      provide: APP_INITIALIZER,
      useFactory: (swm: SWManagementService) => () => swm.ready,
      deps: [SWManagementService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => undefined,
      deps: [
        SWManagementService,
        AuthService,
        SEOService,
      ],
      multi: true
    },

    provideState(authFeature),
    provideEffects(authEffects),
    provideEffects(signInEffects),

    provideState(UI_FEATURE),
    provideEffects(uiEffects),

    provideState(navMenuFeature),

    provideState(adminData.feature),
    provideEffects(adminDataEffects)
  ],
};
