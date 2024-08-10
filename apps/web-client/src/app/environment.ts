import { inject, InjectionToken } from '@angular/core';
import { ENVIRONMENT_ID } from '@easworks/app-shell/dependency-injection';
import { EnvironmentID } from 'models/environment';

const configs = {
  local: {
    oauth: {
      server: 'http://localhost:4103',
      redirect: 'http://localhost:4104'
    },
    sso: {
      domain: 'localhost'
    }
  },
  development: {
    oauth: {
      server: 'https://accounts.development.branches.easworks.com',
      redirect: 'https://development.branches.easworks.com'
    },
    sso: {
      domain: 'development.branches.easworks.com'
    }
  },
  production: {
    oauth: {
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