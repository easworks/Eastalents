import { InjectionToken } from '@angular/core';

export interface Environment {
  // readonly apiUrl: string;
  // readonly imageUrl: string;
}

export const ENVIRONMENT = new InjectionToken<Environment>('developer-provided environment settings');
