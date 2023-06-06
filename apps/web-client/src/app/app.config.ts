import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthService, DefaultSeoConfig, SEOService, SEO_DEFAULT_CONFIG, provideRootServices } from '@easworks/app-shell';
import { provideEnvironment } from './environment';
import { routes } from './routes';
import { SignInEffects } from './sign-in.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    provideEnvironment(),
    {
      provide: SEO_DEFAULT_CONFIG, useValue: {
        baseTitle: 'EasWorks',
        defaultDescription: 'EasWorks'
      } satisfies DefaultSeoConfig
    },
    importProvidersFrom([
      MatSnackBarModule,
    ]),
    provideRootServices(
      AuthService,
      SEOService,
      SignInEffects,
      MatSnackBarModule,
    )
  ],
};
