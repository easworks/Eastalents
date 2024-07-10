import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const PLATFORM_TYPE = new InjectionToken(
  'PLATFORM_TYPE',
  {
    providedIn: 'platform',
    factory: () => {
      const id = inject(PLATFORM_ID);
      return isPlatformBrowser(id) ? 'browser' : 'server';
    }
  }
);