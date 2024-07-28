import { isDevMode } from '@angular/core';
import { isBrowser } from '../utilities/platform-type';

export class ApiService {
  protected readonly devMode = isDevMode();
  protected readonly isBrowser = isBrowser();
}