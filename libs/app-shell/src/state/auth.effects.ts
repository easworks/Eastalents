import { effect, inject, INJECTOR } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, from, map, of } from 'rxjs';
import { AuthStorageService } from '../services/auth.storage';
import { SWManagerService } from '../services/sw.manager';
import { isBrowser } from '../utilities/platform-type';
import { authActions, authFeature } from './auth';

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