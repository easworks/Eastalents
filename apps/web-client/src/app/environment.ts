import { isDevMode } from '@angular/core';


const devMode = isDevMode();

const configs = {
  development: {
    oauth: {
      origin: 'http://localhost:4103'
    },
    sso: {
      domain: 'localhost'
    }
  },
  production: {
    oauth: {
      origin: 'https://accounts.easworks.com'
    },
    sso: {
      domain: 'easworks.com'
    }
  }
} as const;

export const env = devMode ?
  configs.development :
  configs.production;