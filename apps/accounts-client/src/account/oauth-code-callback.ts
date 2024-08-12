import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApi } from '@easworks/app-shell/api/auth.api';
import { CLIENT_CONFIG } from '@easworks/app-shell/dependency-injection';
import { AuthService } from '@easworks/app-shell/services/auth';
import { base64url } from '@easworks/app-shell/utilities/base64url';
import { isServer } from '@easworks/app-shell/utilities/platform-type';
import { RETURN_URL_KEY } from 'models/auth';
import { pattern } from 'models/pattern';
import { authValidators } from 'models/validators/auth';
import { catchError, map, of, switchMap } from 'rxjs';
import { z } from 'zod';

const queryValidator = z.object({
  code: z.string().min(1),
  state: z.string()
    .regex(pattern.base64.urlSafe)
    .transform(v => JSON.parse(base64url.toString(v)))
    .pipe(z.object({
      provider: authValidators.externalIdp,
      [RETURN_URL_KEY]: z.string().optional(),
      role: z.string().optional()
    }).passthrough())
}).passthrough();

export const oauthCodeCallback: CanActivateFn = (snap) => {
  if (isServer())
    return false;

  const api = inject(AuthApi);
  const auth = inject(AuthService);
  const router = inject(Router);
  const config = inject(CLIENT_CONFIG).oauth;

  const parsed = queryValidator.parse(snap.queryParams);

  return api.social.codeExchange({
    idp: parsed.state.provider,
    code: parsed.code,
    redirect_uri: `${config.server}/oauth/callback`
  }).pipe(
    switchMap(output => {
      if (output.result === 'sign-in') {
        return auth.signIn.token(output.data.access_token, parsed.state[RETURN_URL_KEY]);
      }
      else {
        console.debug(parsed.state, output);
        return router.navigateByUrl('/sign-up');
      }
    }),
    map(() => true),
    catchError(() => of(false)),
    takeUntilDestroyed()
  );
};