import { Location } from '@angular/common';
import { computed, effect, inject, INJECTOR, isDevMode } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, EMPTY, from, map, merge, of, switchMap } from 'rxjs';
import { UsersApi } from '../api/users.api';
import { CLIENT_CONFIG } from '../dependency-injection';
import { AuthService } from '../services/auth';
import { CookieService } from '../services/auth.cookie';
import { AUTH_READY } from '../services/auth.ready';
import { AuthStorageService } from '../services/auth.storage';
import { SWManagerService } from '../services/sw.manager';
import { isBrowser } from '../utilities/platform-type';
import { authActions, authFeature, getAuthUserFromModel } from './auth';

export const authEffects = {
  logUserInDevMode: createEffect(
    () => {
      if (!isDevMode() || !isBrowser())
        return EMPTY;

      const store = inject(Store);
      const storage = inject(AuthStorageService);
      const user$ = store.selectSignal(authFeature.selectUser);

      effect(async () => {
        const user = user$();
        if (user) {
          const token = await storage.token.get();
          console.debug(user);
          console.debug(token);
        }
      });

      return EMPTY;
    },
    { functional: true, dispatch: false }
  ),

  onTokenChange: createEffect(
    () => {
      const actions$ = inject(Actions);
      const storage = inject(AuthStorageService);
      const api = inject(UsersApi);
      const clientConfig = inject(CLIENT_CONFIG);
      const cookies = inject(CookieService);

      const devMode = isDevMode();

      const oauth = clientConfig.oauth;
      const sso = clientConfig.sso;

      return actions$.pipe(
        ofType(authActions.idTokenChanged),
        switchMap(({ payload }) => {
          if (!payload.token)
            return of(null);

          if (payload.loadUser) {
            return api.self()
              .pipe(
                switchMap(async self => {
                  const user = getAuthUserFromModel(self.user, self.permissionRecord);
                  await storage.user.set(user);
                  return user;
                })
              );
          }
          else {
            return storage.user.get();
          }
        }),
        switchMap(async user => {
          // during development, the auth server and client
          // may exist on different domains
          // therefore, allow client to write cookies in development
          if ((oauth.type === 'server' || devMode) && sso && user) {
            const expiry = await storage.expiry.get();
            if (!expiry)
              throw new Error('expiry should not be null');
            cookies.USER_ID.write(user._id, expiry.toISO(), sso.domain);
          }
          return user;
        }),
        map(user => authActions.updateUser({ payload: { user } }))
      );
    },
    { functional: true }
  ),

  onPageLoad: createEffect(
    () => {
      const storage = inject(AuthStorageService);
      const clientConfig = inject(CLIENT_CONFIG);
      const cookies = inject(CookieService);

      const token$ = (() => {
        if (!isBrowser())
          return of(null);

        if (clientConfig.sso) {
          cookies.read();
          if (!cookies.USER_ID.$())
            return of(null);
        }

        return from(storage.token.get());
      })();

      return token$.pipe(
        map(token => authActions.idTokenChanged({ payload: { token } }))
      );
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

      const uid$ = toObservable(userId$)
        .pipe(map(userId => {
          cookies.read();
          return [userId, cookieId$()];
        }));
      const cid$ = toObservable(cookieId$)
        .pipe(map(cookieId => [userId$(), cookieId]));

      return from(ready)
        .pipe(
          switchMap(() => merge(uid$, cid$)),
          distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1]),
          switchMap(async ([userId, cookieId]) => {
            if (userId === cookieId) {
              // user id and cookie id match, OR
              // user id and cookie id are both empty
              // - do nothing
              return;
            }

            if (!cookieId && userId) {
              // cookie does not exist, but user exists
              // - sign out
              await auth.signOut();
              return;
            }

            {
              // cookie id exists, but does not match user

              if (isAuthServer) {
                const token = await storage.token.get();
                if (token) {
                  window.location.reload();
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

                await auth.signIn.easworks(path);
                return;
              }
            }
          })
        );
    },
    { functional: true, dispatch: false }
  ),

  onSignOut: createEffect(() => {
    const actions$ = inject(Actions);
    const sso = inject(CLIENT_CONFIG).sso;
    const cookies = inject(CookieService);
    const router = inject(Router);
    const store = inject(Store);
    const storage = inject(AuthStorageService);

    return actions$.pipe(
      ofType(authActions.signOut),
      switchMap(async ({ payload }) => {
        await storage.clear();
        if (sso)
          cookies.USER_ID.delete(sso.domain);

        if (payload.revoked)
          location.reload();
        else {
          await router.navigateByUrl('/', {
            info: {
              source: authActions.signOut.type
            }
          });
        }
        store.dispatch(authActions.idTokenChanged({ payload: { token: null } }));
      }),
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