import { effect, inject, INJECTOR } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PERMISSION_DEF_DTO } from 'models/permissions';
import { UserWithToken } from 'models/user';
import { EMPTY, fromEvent, of, tap } from 'rxjs';
import { SWManagerService } from '../services/sw.manager';
import { isBrowser, isServer } from '../utilities/platform-type';
import { authActions, authFeature, CURRENT_USER_KEY } from './auth';

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
  readOnFirstLoad: createEffect(
    () => {


      let user: UserWithToken | null = null;

      if (isBrowser()) {
        try {
          const storedUser = localStorage.getItem(CURRENT_USER_KEY);
          if (storedUser) {
            user = JSON.parse(storedUser);
          }
        }
        catch (e) {
          user = null;
        }
      }
      return of(
        authActions.updatePermissionDefinition({ dto: PERMISSION_DEF_DTO }),
        authActions.updateUser({ payload: { user } })
      );


    },
    { functional: true }
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