import { Location } from '@angular/common';
import { Provider, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_GUARD_SIGN_IN_ACTION } from '@easworks/app-shell/services/auth.guard';
import { isBrowser } from '@easworks/app-shell/utilities/platform-type';
import { RETURN_URL_KEY } from 'models/auth';

export const AUTH_GUARD_ACTIONS: Provider[] = [
  {
    provide: AUTH_GUARD_SIGN_IN_ACTION,
    useFactory: () => {
      if (!isBrowser())
        return () => { };

      const router = inject(Router);
      const location = inject(Location);

      return async () => {
        const returnUrl = location.path();
        await router.navigate(['/sign-in'], {
          queryParams: {
            [RETURN_URL_KEY]: returnUrl
          }
        });
      };

    }
  }
];