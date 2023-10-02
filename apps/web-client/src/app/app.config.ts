import { ViewportScroller } from '@angular/common';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { AuthService } from '@easworks/app-shell/services/auth';
import { DefaultSeoConfig, SEOService, SEO_DEFAULT_CONFIG } from '@easworks/app-shell/services/seo';
import { SWManagementService, SW_URL } from '@easworks/app-shell/services/sw.manager';
import { SignInEffects } from '../account/sign-in.effects';
import { serviceWorkerUrl } from '../service-worker/sw.loader';
import { provideEnvironment } from './environment';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
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
        SignInEffects
      ],
      multi: true
    }
  ],
};
