import { inject, InjectionToken } from '@angular/core';
import { ENVIRONMENT_ID } from '@easworks/app-shell/dependency-injection';
import { EnvironmentID } from 'models/environment';

const configs = {
  local: {
    oauth: {
      clientId: "66a98aad5c881fc8f3ca2a57",
      server: 'http://localhost:4103',
      redirect: 'http://localhost:4104'
    },
    sso: {
      domain: 'localhost'
    }
  },
  development: {
    oauth: {
      clientId: "66b7895420c29768cd795c19",
      server: 'https://accounts.development.branches.easworks.com',
      redirect: 'https://development.branches.easworks.com'
    },
    sso: {
      domain: 'development.branches.easworks.com'
    }
  },
  production: {
    oauth: {
      clientId: "66b789d820c29768cd795c1a",
      server: 'https://accounts.easworks.com',
      redirect: 'https://easworks.com'
    },
    sso: {
      domain: 'easworks.com'
    }
  },
} as const satisfies Record<EnvironmentID, unknown>;

export const ENVIRONMENT = new InjectionToken('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => {
    const envId = inject(ENVIRONMENT_ID);

    return configs[envId];
  }
});