import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthService, DefaultSeoConfig, ENVIRONMENT, SEOService, SEO_DEFAULT_CONFIG, provideRootServices } from '@easworks/app-shell';
import { environmentFactory } from './environment';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    { provide: ENVIRONMENT, useFactory: environmentFactory },
    {
      provide: SEO_DEFAULT_CONFIG, useValue: {
        baseTitle: 'EasWorks',
        defaultDescription: 'EasWorks'
      } satisfies DefaultSeoConfig
    },
    provideRootServices(AuthService, SEOService)
  ],
};
