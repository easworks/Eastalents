import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const env: Environment = devMode ?
  {
    apiUrl: 'http://localhost:3334/api',
    imageUrl: 'http://localhost:3334',
  } :
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'https://eas-works.onrender.com',
  };


export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env }
}