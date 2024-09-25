import { inject } from '@angular/core';
import { CanActivateFn, GuardResult } from '@angular/router';
import { AuthService } from '@easworks/app-shell/services/auth';
import { isServer } from '@easworks/app-shell/utilities/platform-type';
import { base64url } from '@easworks/models/utils/base64url';
import { RETURN_URL_KEY } from 'models/auth';
import { switchMap } from 'rxjs';

export const oauthCodeCallback: CanActivateFn = (snap) => {
  if (isServer()) return true;

  const auth = inject(AuthService);

  const params = snap.queryParamMap;

  const code = params.get('code');
  if (!code)
    throw new Error('code should not be null');
  const stateB64 = params.get('state');
  let returnUrl: string | undefined;
  if (stateB64) {
    try {
      const state = JSON.parse(base64url.toString(stateB64));
      returnUrl = state[RETURN_URL_KEY];
    }
    catch (err) { /* empty */ }
  }

  return auth.signIn.oauthCode(code, returnUrl)
    .pipe(switchMap(() => new Promise<GuardResult>(() => undefined)));
};