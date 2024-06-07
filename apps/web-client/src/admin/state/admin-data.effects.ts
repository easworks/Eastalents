import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, from, map } from 'rxjs';
import { AdminApi } from '../api/admin.api';
import { AdminDataDTO } from '../models/admin-data';
import { adminData, adminDataActions, softwareProductActions, techGroupActions, techSkillActions } from './admin-data';

export const adminDataEffects = {
  loadFromApi: createEffect(
    () => {
      const api = inject(AdminApi);

      // const domainApi = inject(DomainsApi);

      const data = Promise.all([
        api.softwareProducts.read(),
        api.techSkills.read(),
        api.techGroups.read()
      ]).then<AdminDataDTO>(results => ({
        softwareProducts: results[0],
        techSkills: results[1],
        techGroups: results[2]
      }));
      // .then(async results => {
      //   const tgDto = await domainApi.techGroups();
      //   const maps = extractTechSkills(tgDto);
      //   results.techGroups = [...maps.techGroups.values()].sort((a, b) => sortString(a.id, b.id));
      //   results.techSkills = [...maps.techSkills.values()].sort((a, b) => sortString(a.id, b.id));
      //   return results;
      // });

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
  ),

  saveTechGroups: createEffect(
    () => {
      const api = inject(AdminApi);
      const actions$ = inject(Actions);
      const store = inject(Store);

      const list$ = store.selectSignal(adminData.selectors.techGroup.selectAll);

      return actions$.pipe(
        ofType(
          adminDataActions.saveState,
          techGroupActions.add,
          techGroupActions.update,
          techGroupActions.addSkill,
          techGroupActions.removeSkill
        ),
        concatMap(() => api.techGroups.write(list$()))
      );
    },
    { functional: true, dispatch: false }
  )

};
