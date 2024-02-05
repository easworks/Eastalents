import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const env: Environment = devMode ?
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'https://eas-works.onrender.com/api',
  } :
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'https://eas-works.onrender.com/api',
  };


export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env };
}
