import { inject, Provider } from '@angular/core';
import { CLIENT_CONFIG } from '@easworks/app-shell/dependency-injection';
import { ClientConfig } from 'models/client-config';
import { ENVIRONMENT } from './environment';

export function provideClientConfig(): Provider {
  return {
    provide: CLIENT_CONFIG,
    useFactory: () => {
      const env = inject(ENVIRONMENT);

      return {
        version: '1.0.0',
        seo: {
          baseTitle: 'Accounts | EASWORKS',
          defaultDescription: 'Manage your EASWORKS account'
        },
        oauth: {
          type: 'server',
          server: env.oauth.server,
          endpoints: {
            authorize: '/api/oauth/authorize'
          },
        },
        sso: {
          domain: env.sso.domain
        }
      } satisfies ClientConfig;
    }
  };
}