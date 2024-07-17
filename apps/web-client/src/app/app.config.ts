import { ViewportScroller } from '@angular/common';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { DefaultSeoConfig, SEO_DEFAULT_CONFIG } from '@easworks/app-shell/services/seo';
import { SW_MANAGER } from '@easworks/app-shell/services/sw.manager';
import { authFeature } from '@easworks/app-shell/state/auth';
import { authEffects } from '@easworks/app-shell/state/auth.effects';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';
import { uiEffects } from '@easworks/app-shell/state/ui.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEnvironment } from './environment';
import { routes } from './routes';
import { adminData } from '../admin/state/admin-data';
import { adminDataEffects } from '../admin/state/admin-data.effects';

export const appConfig: ApplicationConfig = {

  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(
      withEventReplay(),
    ),
    provideStore(),
    provideEffects(),
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
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => undefined,
      deps: [
        SW_MANAGER,
        // AuthService,
        // SEOService,
      ],
      multi: true
    },

    provideState(UI_FEATURE),
    provideEffects(uiEffects),

    provideState(authFeature),
    provideEffects(authEffects),
    // provideEffects(signInEffects),

    // provideEffects(navMenuEffects),
    // provideEffects(menuItemEffects),



    // provideState(navMenuFeature),

    provideState(adminData.feature),
    provideEffects(adminDataEffects)
  ],
};
