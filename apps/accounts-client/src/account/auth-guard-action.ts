import { Location } from '@angular/common';
import { Provider, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_GUARD_SIGN_IN_ACTION } from '@easworks/app-shell/services/auth.guard';
import { RETURN_URL_KEY } from 'models/auth';

export const AUTH_GUARD_ACTIONS: Provider[] = [
  {
    provide: AUTH_GUARD_SIGN_IN_ACTION,
    useFactory: () => {
      const router = inject(Router);
      const location = inject(Location);

      return () => {
        const returnUrl = location.path();
        router.navigate(['/sign-in'], {
          queryParams: {
            [RETURN_URL_KEY]: returnUrl
          }
        });
      };

    }
  }
];