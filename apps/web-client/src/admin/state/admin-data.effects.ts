import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, from, map } from 'rxjs';
import { AdminApi } from '../api/admin.api';
import { AdminDataDTO } from '../models/admin-data';
import { adminData, adminDataActions, softwareProductActions, techSkillActions } from './admin-data';
import { Store } from '@ngrx/store';

export const adminDataEffects = {
  loadFromApi: createEffect(
    () => {
      const api = inject(AdminApi);
      const data = Promise.all([
        api.softwareProducts.read(),
        api.techSkills.read(),
        api.techGroups.read()
      ]).then<AdminDataDTO>(results => ({
        softwareProducts: results[0],
        techSkills: results[1],
        techGroups: results[2]
      }));

      return from(data)
        .pipe(
          map(payload => adminDataActions.updateState({ payload: payload }))
        );
    },
    { functional: true }
  ),

  saveSoftwareProducts: createEffect(
    () => {
      const api = inject(AdminApi);
      const actions$ = inject(Actions);
      const store = inject(Store);

      const list$ = store.selectSignal(adminData.selectors.softwareProduct.selectAll);

      return actions$.pipe(
        ofType(
          adminDataActions.saveState,
          softwareProductActions.add,
          softwareProductActions.update
        ),
        concatMap(() => api.softwareProducts.write(list$()))
      );
    },
    { functional: true, dispatch: false }
  ),

  saveTechSkills: createEffect(
    () => {
      const api = inject(AdminApi);
      const actions$ = inject(Actions);
      const store = inject(Store);

      const list$ = store.selectSignal(adminData.selectors.techSkill.selectAll);

      return actions$.pipe(
        ofType(
          adminDataActions.saveState,
          techSkillActions.add,
          techSkillActions.update
        ),
        concatMap(() => api.techSkills.write(list$()))
      );
    },
    { functional: true, dispatch: false }
  )

};
