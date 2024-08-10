import { inject, InjectionToken, Provider } from '@angular/core';
import { ClientConfig } from 'models/client-config';
import { EnvironmentID } from 'models/environment';
import { isBrowser } from './utilities/platform-type';

export const ENVIRONMENT_ID = new InjectionToken<EnvironmentID>('ENVIRONMENT_ID');

export function provideBrowserEnvID(): Provider {
  return {
    provide: ENVIRONMENT_ID,
    useFactory: () => {
      const parent = inject(ENVIRONMENT_ID, { optional: true, skipSelf: true });
      if (parent)
        return parent;

      if (isBrowser()) {
        const hostname = window.location.hostname;
        switch (true) {
          case hostname.endsWith('localhost'): return 'local';
          case hostname.endsWith('development.branches.easworks.com'): return 'development';
          case hostname.endsWith('easworks.com'): return 'production';
          default: throw new Error('unknow environment');
        }
      }

      // the vite dev-server is unable to use 
      // the injected ENVIRONMENT_ID from fastify
      // so we provide 'local' by default
      return 'local';
    }
  };
}

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('CLIENT_CONFIG');

export const OAUTH_SERVER_CONFIG = new InjectionToken('OAUTH_SERVER_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const config = inject(CLIENT_CONFIG).oauth;

    if (config.type !== 'server')
      throw new Error('invalid oauth host config was provided as part of ClientConfig');

    return config;
  }
});

export const OAUTH_CLIENT_CONFIG = new InjectionToken('OAUTH_CLIENT_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const config = inject(CLIENT_CONFIG).oauth;
    if (config.type !== 'client')
      throw new Error('invalid oauth client config was provided as part of ClientConfig');

    return config;
  }
});