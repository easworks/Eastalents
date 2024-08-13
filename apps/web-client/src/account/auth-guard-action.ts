import { Location } from '@angular/common';
import { Provider, inject } from '@angular/core';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AUTH_GUARD_SIGN_IN_ACTION } from '@easworks/app-shell/services/auth.guard';
import { isBrowser } from '@easworks/app-shell/utilities/platform-type';

export const AUTH_GUARD_ACTIONS: Provider[] = [
  {
    provide: AUTH_GUARD_SIGN_IN_ACTION,
    useFactory: () => {
      if (!isBrowser())
        return () => { };

      const location = inject(Location);
      const auth = inject(AuthService);

      return async () => {
        const returnUrl = location.path();
        await auth.signIn.easworks(returnUrl);
      };

    }
  }
];