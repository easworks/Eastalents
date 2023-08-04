import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const gMapApiKey = '';
const cscApiKey = '';

const env: Environment = devMode ?
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'http://eas-works.onrender.com',
    gMapApiKey,
    cscApiKey
  } :
  {
    apiUrl: 'https://eas-works.onrender.com/api',
    imageUrl: 'https://eas-works.onrender.com',
    gMapApiKey,
    cscApiKey
  };


export function provideEnvironment(): Provider {
  // eslint-disable-next-line no-irregular-whitespace
  return { provide: ENVIRONMENT, useValue: env }
}