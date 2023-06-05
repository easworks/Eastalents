import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountApi, AuthService } from '@easworks/app-shell';
import { RETURN_URL_KEY, SocialCallbackState } from '@easworks/models';

export const socialCallback: CanActivateFn = (route) => {
  try {
    const stateString = route.queryParamMap.get('state');
    if (!stateString)
      throw new Error(`'state' query parameter was expected but not found`);
    const state = JSON.parse(stateString) as SocialCallbackState;

    const code = route.queryParamMap.get('code');
    if (!code)
      throw new Error(`'code' query parameter was expected but not found`);

    const api = inject(AccountApi);
    const result = api.signIn.social({ provider: state.provider, code });

    const auth = inject(AuthService);
    // if ('token' in result) {
    //   auth.handleSignIn(result.token, state[RETURN_URL_KEY]);
    // }
    // else {
    // auth.handlePartialSocialSignIn(state.provider, result);
    // }
  }
  catch (e) {
    console.error(e);
  }

  return true;
}
