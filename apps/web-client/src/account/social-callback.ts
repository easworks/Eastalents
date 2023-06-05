import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountApi, AuthService, RETURN_URL_KEY, SocialCallbackState } from '@easworks/app-shell';

export const socialCallback: CanActivateFn = (route) => {
  try {
    const stateString = route.queryParamMap.get('state');
    if (!stateString)
      throw new Error(`'state' query parameter was expected but not found`);
    const state = JSON.parse(stateString) as SocialCallbackState;

    const api = inject(AccountApi);
    const auth = inject(AuthService);

    switch (state.provider) {
      case 'google': {
        const code = route.queryParamMap.get('code');
        if (!code)
          throw new Error(`'code' query parameter was expected but not found`);

        const result = api.signIn.google({ code });
        if ('token' in result) {
          auth.handleSignIn(result.token, state[RETURN_URL_KEY]);
        }
      } break;
      default: throw new Error('not implemented');
    }
  }
  catch (e) {
    console.error(e);
  }

  return true;
}
