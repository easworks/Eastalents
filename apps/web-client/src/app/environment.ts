import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const env: Environment = devMode ?
  {
    apiUrl: 'http://eas-works-env.eba-vekypqrx.us-west-1.elasticbeanstalk.com/api',
    imageUrl: 'http://eas-works-env.eba-vekypqrx.us-west-1.elasticbeanstalk.com/',
  } :
  {
    apiUrl: 'http://eas-works-env.eba-vekypqrx.us-west-1.elasticbeanstalk.com/api',
    imageUrl: 'http://eas-works-env.eba-vekypqrx.us-west-1.elasticbeanstalk.com/',
  };


export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: env };
}
