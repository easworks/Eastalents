import { inject, InjectionToken } from '@angular/core';
import { ClientConfig } from 'models/client-config';

export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('CLIENT_CONFIG');

export const OAUTH_HOST_CONFIG = new InjectionToken('OAUTH_HOST_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const config = inject(CLIENT_CONFIG).oauth;

    if (config.type !== 'host')
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