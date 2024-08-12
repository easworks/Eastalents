import { APP_BASE_HREF, ViewportScroller } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors, withNoXsrfProtection } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { easworksApiInterceptor } from '@easworks/app-shell/api/easworks.api.interceptor';
import { CLIENT_CONFIG, provideBrowserEnvID } from '@easworks/app-shell/dependency-injection';
import { AuthService } from '@easworks/app-shell/services/auth';
import { SEO_DEFAULT_CONFIG, SEOService } from '@easworks/app-shell/services/seo';
import { SWManagerService } from '@easworks/app-shell/services/sw.manager';
import { authFeature } from '@easworks/app-shell/state/auth';
import { authEffects } from '@easworks/app-shell/state/auth.effects';
import { navMenuFeature } from '@easworks/app-shell/state/nav-menu';
import { navMenuEffects } from '@easworks/app-shell/state/nav-menu.effects';
import { uiFeature } from '@easworks/app-shell/state/ui';
import { uiEffects } from '@easworks/app-shell/state/ui.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { signInEffects } from '../account/sign-in.effects';
import { adminData } from '../admin/state/admin-data';
import { adminDataEffects } from '../admin/state/admin-data.effects';
import { provideClientConfig } from './client.config';
import { menuItemEffects } from './menu-items/menu-item.effects';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {

  providers: [
    provideBrowserEnvID(),
    provideClientConfig(),

    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: SEO_DEFAULT_CONFIG,
      useFactory: () => inject(CLIENT_CONFIG).seo
    },

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
    provideHttpClient(
      withFetch(),
      withNoXsrfProtection(),
      withInterceptors([
        easworksApiInterceptor
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

    importProvidersFrom([
      MatSnackBarModule,
      MatDialogModule
    ]),
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => undefined,
      deps: [
        SWManagerService,
        AuthService,
        SEOService,
      ],
      multi: true
    },

    provideState(uiFeature),
    provideEffects(uiEffects),

    provideState(authFeature),
    provideEffects(authEffects),
    provideEffects(signInEffects),

    provideState(navMenuFeature),
    provideEffects(navMenuEffects),
    provideEffects(menuItemEffects),

    provideState(adminData.feature),
    provideEffects(adminDataEffects)
  ],
};
