import { Location } from '@angular/common';
import { effect, inject, INJECTOR } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RETURN_URL_KEY } from 'models/auth';
import { EMPTY, from, map, of } from 'rxjs';
import { CLIENT_CONFIG } from '../dependency-injection';
import { AuthService } from '../services/auth';
import { CookieService } from '../services/auth.cookie';
import { AuthStorageService } from '../services/auth.storage';
import { SWManagerService } from '../services/sw.manager';
import { base64url } from '../utilities/base64url';
import { isBrowser } from '../utilities/platform-type';
import { authActions, authFeature } from './auth';

export const authEffects = {
  onPageLoad: createEffect(
    () => {
      const storage = inject(AuthStorageService);

      const user$ = isBrowser() ?
        from(storage.user.get()) :
        of(null);

      const actions$ = user$.pipe(
        map(user => authActions.updateUser({ payload: { user } }))
      );

      return actions$;
    },
    { functional: true }
  ),

  syncSSO: createEffect(
    () => {
      const clientConfig = inject(CLIENT_CONFIG);
      const sso = clientConfig.sso;
      if (!sso)
        return EMPTY;
      const isAuthHost = clientConfig.oauth.type === 'host';

      const storage = inject(AuthStorageService);
      const store = inject(Store);
      const cookies = inject(CookieService);
      const auth = inject(AuthService);
      const location = inject(Location);

      const user$ = store.selectSignal(authFeature.selectUser);
      const ready$ = store.selectSignal(authFeature.selectReady);
      const userCookie = cookies.USER_ID;

      // always read cookie on user change
      if (isBrowser()) {
        effect(() => {
          if (!ready$())
            return;

          user$();
          cookies.read();
        }, { allowSignalWrites: true });
      }


      effect(async () => {
        if (!ready$())
          return;

        const cookieId = userCookie.$();
        const userId = user$()?._id || null;

        if (userId === cookieId) {
          // user id and cookie id match, OR
          // user id and cookie id are both empty
          // - do nothing
          return;
        }

        if (userId && !cookieId) {
          // user exists, but cookie does not exist
          // - sign out
          await auth.signOut();
          return;
        }

        {
          // cookie id exists, but does not match user

          if (isAuthHost) {

            if (userId) {
              const exp = await storage.expiry.get()
                .then(dt => dt!.toISO());
              userCookie.write(userId, exp, sso.domain);
            }
            else {
              userCookie.delete(sso.domain);
            }
            return;
          }
          else {
            const path = location.path();
            if (path.startsWith(clientConfig.oauth.callbackPath))
              return;

            const state = {
              [RETURN_URL_KEY]: path
            };

            const state64 = base64url.fromString(JSON.stringify(state));
            await auth.signIn.easworks(state64);
            return;
          }
        }
      });

      return EMPTY;
    },
    { functional: true, dispatch: false }
  ),

  reloadOnSignOut: createEffect(() => {
    const actions$ = inject(Actions);

    return actions$.pipe(
      ofType(authActions.signOut),
      map(() => location.reload())
    );
  }, { functional: true, dispatch: false }),

  syncWithServiceWorker: createEffect(
    () => {
      if (!isBrowser())
        return EMPTY;

      const swm = inject(SWManagerService);
      const injector = inject(INJECTOR);
      const store = inject(Store);

      const user$ = store.selectSignal(authFeature.selectUser);

      swm.ready
        .then(() => swm.wb)
        .then(wb => {
          if (!wb)
            return;

          effect(() => {
            const user = user$();
            wb.messageSW({
              type: 'USER CHANGE', payload: {
                user
              }
            });
          }, { injector });
        });

      return EMPTY;
    },
    { functional: true, dispatch: false }
  ),

} as const;