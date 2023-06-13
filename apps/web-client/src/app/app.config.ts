import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AuthInterceptor, AuthService, DefaultSeoConfig, SEOService, SEO_DEFAULT_CONFIG } from '@easworks/app-shell';
import { SignInEffects } from '../account/sign-in.effects';
import { provideEnvironment } from './environment';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        AuthInterceptor.asFunction
      ])
    ),
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
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => async () => {
        await auth.ready;
      },
      deps: [
        AuthService,
        SEOService,
        SignInEffects
      ],
      multi: true
    }
  ],
};
