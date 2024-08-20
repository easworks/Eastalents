import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, ResolveFn, Router } from '@angular/router';
import { AuthApi } from '@easworks/app-shell/api/auth.api';
import { CLIENT_CONFIG } from '@easworks/app-shell/dependency-injection';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { base64url } from '@easworks/app-shell/utilities/base64url';
import { isServer } from '@easworks/app-shell/utilities/platform-type';
import { RETURN_URL_KEY } from 'models/auth';
import { pattern } from 'models/pattern';
import { authValidators } from 'models/validators/auth';
import { catchError, NEVER, of, switchMap } from 'rxjs';
import { z } from 'zod';

const queryValidator = z.object({
  code: z.string().min(1),
  state: z.string()
    .regex(pattern.base64.urlSafe)
    .transform(v => JSON.parse(base64url.toString(v)))
    .pipe(z.object({
      idp: authValidators.externalIdp,
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
  const snackbar = inject(MatSnackBar);

  const query = queryValidator.parse(snap.queryParams);

  return api.social.codeExchange({
    idp: query.state.idp,
    code: query.code,
    redirect_uri: `${config.server}/oauth/callback`
  }).pipe(
    switchMap(output => {
      switch (output.action) {
        case 'sign-in':
          return auth.signIn.token(output.data.access_token, query.state[RETURN_URL_KEY]);
        case 'sign-up':
          const forwardQuery = {} as Record<string, string>;

          if (query.state[RETURN_URL_KEY])
            forwardQuery[RETURN_URL_KEY] = query.state[RETURN_URL_KEY];

          const path = (() => {
            switch (query.state.role) {
              case 'talent': return '/sign-up/talent';
              case 'employer': return '/sign-up/employer';
              default: return '/sign-up';
            }
          })();

          const token = output.data;
          const payload = JSON.parse(base64url.toString(token.split('.')[1]));
          if (payload.type !== 'state:ExternalIdpUser')
            throw new Error('state token type mismatch');
          if (payload.provider !== query.state.idp)
            throw new Error('identity provider mismatch');

          const info = {
            source: 'code-exchange',
            token,
            externalUser: payload.externalUser,
            isFreeEmail: payload.isFreeEmail,
            idp: query.state.idp,
          };

          return router.navigate([path], {
            queryParams: forwardQuery,
            info
          });
        case 'verify-email':
          return router.navigateByUrl('/verify-email');
      }
    }),
    switchMap(() => NEVER),
    catchError((e) => {
      SnackbarComponent.forError(snackbar, e);
      return of(false);
    }),
    takeUntilDestroyed()
  );
};

export const resolveSocialPrefill: ResolveFn<any> = () => {
  const nav = inject(Router).getCurrentNavigation();

  const info = nav?.extras.info as any;

  if (info?.source === 'code-exchange')
    return info;

  return null;
};