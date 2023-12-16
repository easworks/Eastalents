import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const env: Environment = devMode ?
  {
    apiUrl: 'https://www.suggestmachines.com/api',
    imageUrl: 'https://www.suggestmachines.com/',
  } :
  {
    apiUrl: 'https://www.suggestmachines.com/api',
    imageUrl: 'https://www.suggestmachines.com/',
  };


export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env };
}
