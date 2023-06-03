import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell';


const devMode = isDevMode();

const env: Environment = devMode ?
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'https://eas-works.onrender.com',
  } :
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'https://eas-works.onrender.com',
  };


export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env }
}