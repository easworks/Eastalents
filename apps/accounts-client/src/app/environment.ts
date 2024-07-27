import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const env: Environment = devMode ?
  {} :
  {};

export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env };
}
