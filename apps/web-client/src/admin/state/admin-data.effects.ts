import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { AdminApi } from '../api/admin.api';
import { from, map } from 'rxjs';
import { adminDataActions } from './admin-data';

export const adminDataEffects = {
  loadFromApi: createEffect(
    () => {
      console.debug('effect was called');
      const api = inject(AdminApi);
      const data = api.get();

      return from(data)
        .pipe(
          map(payload => adminDataActions.updateState({ payload: payload }))
        );
    },
    { functional: true }
  )
};