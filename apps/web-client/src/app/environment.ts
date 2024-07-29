import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const env: Environment = devMode ?
  {
    apiUrl: '/api',

  } :
  {
    apiUrl: '/api'
  };


export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env };
}
