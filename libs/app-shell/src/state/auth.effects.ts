import { INJECTOR, effect, inject } from '@angular/core';
import { UserWithToken } from '@easworks/models';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NEVER, fromEvent, of, tap } from 'rxjs';
import { PERMISSION_DEF_DTO } from '../permissions';
import { SWManagementService } from '../services/sw.manager';
import { CURRENT_USER_KEY, authActions, authFeature } from './auth';

export const authEffects = {
  readOnFirstLoad: createEffect(
    () => {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);

      let user: UserWithToken | null = null;

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
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
      const swm = inject(SWManagementService);
      const injector = inject(INJECTOR);
      const store = inject(Store);

      const user$ = store.selectSignal(authFeature.selectUser);

      swm.ready.then(() => {
        effect(() => {
          const user = user$();
          swm.wb.messageSW({
            type: 'USER CHANGE', payload: {
              user
            }
          });
        }, { injector });
      });

      return NEVER;
    },
    { functional: true, dispatch: false }
  ),

} as const;