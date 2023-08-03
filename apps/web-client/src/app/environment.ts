import { Provider, isDevMode } from '@angular/core';
import { ENVIRONMENT, Environment } from '@easworks/app-shell/environment';


const devMode = isDevMode();

const gMapApiKey = 'AIzaSyBUGAyE0raWYxJ8LJMWg0y8Xyw3xU_T7Fk';
const cscApiKey = 'MU1ZaUJ2QnU3N2tqcHNNaUJNQ1V2c3VsMktZcUJTYnVBY1FSN3VZSw==';

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
  return { provide: ENVIRONMENT, useValue: env }
}
