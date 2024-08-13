import { Location } from '@angular/common';
import { Provider, inject } from '@angular/core';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AUTH_GUARD_SIGN_IN_ACTION } from '@easworks/app-shell/services/auth.guard';
import { isBrowser } from '@easworks/app-shell/utilities/platform-type';

export const AUTH_GUARD_ACTIONS: Provider[] = [
  {
    provide: AUTH_GUARD_SIGN_IN_ACTION,
    useFactory: () => {
      const location = inject(Location);
      const auth = inject(AuthService);

      if (!isBrowser())
        return () => { };

      return () => {
        const returnUrl = location.path();
        auth.signIn.easworks(returnUrl);
      };

    }
  }
];