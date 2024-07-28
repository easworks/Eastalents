import { ViewportScroller } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors, withNoXsrfProtection } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { authInterceptor } from '@easworks/app-shell/api/auth.interceptor';
import { DefaultSeoConfig, SEO_DEFAULT_CONFIG, SEOService } from '@easworks/app-shell/services/seo';
import { authFeature } from '@easworks/app-shell/state/auth';
import { authEffects } from '@easworks/app-shell/state/auth.effects';
import { uiFeature } from '@easworks/app-shell/state/ui';
import { uiEffects } from '@easworks/app-shell/state/ui.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEnvironment } from './environment';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironment(),
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(
      withEventReplay()
    ),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({
      name: 'Easworks',
      logOnly: true
    }),

    provideHttpClient(
      withFetch(),
      withNoXsrfProtection(),
      withInterceptors([
        authInterceptor
      ])
    ),

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

    {
      provide: SEO_DEFAULT_CONFIG, useValue: {
        baseTitle: 'Accounts | EASWORKS',
        defaultDescription: 'Manage your Easworks account'
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
        SEOService,
      ],
      multi: true
    },

    provideState(uiFeature),
    provideEffects(uiEffects),

    provideState(authFeature),
    provideEffects(authEffects),
  ],
};
