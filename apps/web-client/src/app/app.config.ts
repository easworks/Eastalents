import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
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
    provideRouter(routes,
      withComponentInputBinding()
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
