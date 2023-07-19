import { InjectionToken } from '@angular/core';

export interface Environment {
  readonly apiUrl: string;
  readonly imageUrl: string;
  readonly gMapApiKey: string;
  readonly cscApiKey: string;
}

export const ENVIRONMENT = new InjectionToken<Environment>('developer-provided environment settings');
