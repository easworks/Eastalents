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
          baseTitle: 'EASWORKS',
          defaultDescription: 'EASWORKS'
        },
        oauth: {
          type: 'client',
          server: env.oauth.server,
          clientId: env.oauth.clientId,
          endpoints: {
            authorize: '/api/oauth/authorize',
            token: '/api/oauth/token'
          },
          redirect: {
            origin: env.oauth.redirect,
            path: '/oauth/callback'
          }
        },
        sso: {
          domain: env.sso.domain
        }
      } satisfies ClientConfig;
    }
  };
}
