import { effect, inject, INJECTOR } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { PERMISSION_DEF_DTO } from 'models/permissions';
import { EMPTY, first, from, fromEvent, of, switchMap, takeUntil, tap } from 'rxjs';
import { UsersApi } from '../api/users.api';
import { AuthStorageLockSet, AuthStorageService } from '../services/auth.storage';
import { SWManagerService } from '../services/sw.manager';
import { isBrowser, isServer } from '../utilities/platform-type';
import { authActions, authFeature, CURRENT_USER_KEY, getAuthUserFromModel } from './auth';

export const authEffects = {
  /** This effect does 2 things
    * - add the permission definitions on first load
    * - read the user on first load
    * 
    * The first task is done on both server and browser
    * The second task cannot be done on the browser
    * 
    * Therefore we cannot just return `EMPTY` after `isServer()`,
    * we should gracefully handle the situation
    */
  onPageLoad: createEffect(
    () => {
      const storage = inject(AuthStorageService);
      const api = {
        users: inject(UsersApi)
      };

      const anotherTabStartedRead$ = isBrowser() ?
        fromEvent<StorageEvent>(window, 'storage')
          .pipe(
            first(event => event.key === storage.lock.key),
          ) :
        EMPTY;

      const token$ = isBrowser() ?
        from(storage.token.get()) :
        of(null);

      const user$ = token$
        .pipe(
          switchMap((token) => {
            if (!token)
              return of(null);

            try {
              storage.lock.set();
            }
            catch (e) {
              if (e instanceof AuthStorageLockSet) {
                return of(null);
              }
              throw e;
            }

            return api.users.self();
          }),
          switchMap(async data => {
            if (!data)
              return null;

            const user = getAuthUserFromModel(data.user, data.permissionRecord);

            await storage.user.set(user);
            storage.lock.remove();

            return user;
          }),
          takeUntil(anotherTabStartedRead$),
        );

      const actions$ = user$.pipe(
        switchMap(user => {
          const actions: Action[] = [
            authActions.updatePermissionDefinition({ dto: PERMISSION_DEF_DTO })
          ];

          if (user) {
            actions.push(authActions.updateUser({ payload: { user } }));
          }

          return actions;
        }),
      );

      return actions$;
    },
    { functional: true, dispatch: false }
  ),

  reloadOnUserChange: createEffect(
    () => {
      if (isServer())
        return EMPTY;

      return fromEvent<StorageEvent>(window, 'storage')
        .pipe(
          tap(ev => {
            if (ev.key === CURRENT_USER_KEY) {
              location.reload();
            }
          })
        );
    },
    { functional: true, dispatch: false }
  ),

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