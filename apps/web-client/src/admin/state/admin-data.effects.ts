import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, from, map } from 'rxjs';
import { AdminApi } from '../api/admin.api';
import { ADMIN_DATA_FEATURE, adminDataActions, techSkillActions } from './admin-data';

export const adminDataEffects = {
  loadFromApi: createEffect(
    () => {
      const api = inject(AdminApi);
      const data = api.get();

      return from(data)
        .pipe(
          map(payload => adminDataActions.updateState({ payload: payload }))
        );
    },
    { functional: true }
  ),

  saveOnChanges: createEffect(() => {
    const store = inject(Store);
    const actions$ = inject(Actions);
    const api = inject(AdminApi);

    const data$ = store.selectSignal(ADMIN_DATA_FEATURE.selectAdminDataState);

    return actions$
      .pipe(
        ofType(
          techSkillActions.add,
          techSkillActions.update
        ),
        concatMap(async () => {
          await api.save(data$());
        })
      );
  }, { functional: true, dispatch: false })
};
