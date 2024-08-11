import { Location } from '@angular/common';
import { computed, effect, inject, INJECTOR, isDevMode } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RETURN_URL_KEY } from 'models/auth';
import { distinctUntilChanged, EMPTY, from, map, merge, of, switchMap } from 'rxjs';
import { CLIENT_CONFIG } from '../dependency-injection';
import { AuthService } from '../services/auth';
import { CookieService } from '../services/auth.cookie';
import { AUTH_READY } from '../services/auth.ready';
import { AuthStorageService } from '../services/auth.storage';
import { SWManagerService } from '../services/sw.manager';
import { base64url } from '../utilities/base64url';
import { isBrowser } from '../utilities/platform-type';
import { authActions, authFeature } from './auth';

export const authEffects = {
  logUserInDevMode: createEffect(
    () => {
      if (!isDevMode() || !isBrowser())
        return EMPTY;

      const store = inject(Store);
      const storage = inject(AuthStorageService);
      const user$ = store.selectSignal(authFeature.selectUser);

      effect(async () => {
        console.debug(user$());
        console.debug(await storage.token.get());
      });

      return EMPTY;
    },
    { functional: true, dispatch: false }
  ),

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
      if (!isBrowser())
        return EMPTY;

      const clientConfig = inject(CLIENT_CONFIG);
      const sso = clientConfig.sso;
      if (!sso)
        return EMPTY;
      const isAuthServer = clientConfig.oauth.type === 'server';

      const storage = inject(AuthStorageService);
      const store = inject(Store);
      const cookies = inject(CookieService);
      const auth = inject(AuthService);
      const location = inject(Location);
      const ready = inject(AUTH_READY);

      const user$ = store.selectSignal(authFeature.selectUser);

      const userId$ = computed(() => user$()?._id || null);

      const cookieId$ = cookies.USER_ID.$;

      const merged = merge(
        toObservable(userId$).pipe(
          map(value => {
            cookies.read();
            return [value, cookieId$()] as const;
          })),
        toObservable(cookieId$).pipe(
          switchMap(async (value) => {
            const user = await storage.user.get();
            store.dispatch(authActions.updateUser({ payload: { user } }));
            return [userId$() || null, value] as const;
          })
        )
      ).pipe(distinctUntilChanged((prev, current) => prev[0] === current[0] && prev[1] === current[1]),);

      return from(ready)
        .pipe(
          switchMap(() => merged),
          switchMap(async ([userId, cookieId]) => {
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

              if (isAuthServer) {
                if (userId) {
                  const exp = await storage.expiry.get()
                    .then(dt => dt!.toISO());
                  cookies.USER_ID.write(userId, exp, sso.domain);
                }
                else {
                  cookies.USER_ID.delete(sso.domain);
                }
                return;
              }
              else {
                const path = location.path();
                if (path.startsWith(clientConfig.oauth.redirect.path))
                  return;

                const state = {
                  [RETURN_URL_KEY]: path
                };

                const state64 = base64url.fromString(JSON.stringify(state));
                await auth.signIn.easworks(state64);
                return;
              }
            }
          })
        );
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