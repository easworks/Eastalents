import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, DefaultSeoConfig, SEOService, SEO_DEFAULT_CONFIG, provideRootServices } from 'app-shell';
import { routes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      RouterModule.forRoot(routes)
    ]),
    {
      provide: SEO_DEFAULT_CONFIG, useValue: {
        baseTitle: 'EasWorks',
        defaultDescription: 'EasWorks'
      } satisfies DefaultSeoConfig
    },
    provideRootServices(AuthService, SEOService)
  ],
};
