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
        api.domains.read(),
        api.softwareProducts.read(),
        api.techSkills.read(),
        api.techGroups.read(),
      ]).then<AdminDataDTO>(results => ({
        domains: results[0],
        softwareProducts: results[1],
        techSkills: results[2],
        techGroups: results[3]
      }));
      // .then(async results => {
      //   const logger = new ExtractionLogger();

      //   const domainDto = await domainApi.allDomains();
      //   const tgDto = await domainApi.techGroups();

      //   const maps = {
      //     ...extractDomains(domainDto, logger),
      //     ...extractTechSkills(tgDto, logger)
      //   };

      //   results.domains = [...maps.domains.values()].sort((a, b) => sortString(a.id, b.id));
      //   results.softwareProducts = [...maps.products.values()].sort((a, b) => sortString(a.id, b.id));
      //   results.techGroups = [...maps.techGroups.values()].sort((a, b) => sortString(a.id, b.id));
      //   results.techSkills = [...maps.techSkills.values()].sort((a, b) => sortString(a.id, b.id));

      //   logger.dump();

      //   return results;
      // });

      return from(data)
        .pipe(
          map(payload => adminDataActions.updateState({ payload: payload }))
        );
    },
    { functional: true }
  ),

  saveDomains: createEffect(
    () => {
      const api = inject(AdminApi);
      const actions$ = inject(Actions);
      const store = inject(Store);

      const list$ = store.selectSignal(adminData.selectors.domains.selectAll);

      return actions$.pipe(
        ofType(
          adminDataActions.saveState,
        ),
        concatMap(() => api.domains.write(list$()))
      );
    },
    { functional: true, dispatch: false }
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
          techSkillActions.update,

          techSkillActions.updateGroups,
          techGroupActions.updateSkills
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

        ),
        concatMap(() => api.techGroups.write(list$()))
      );
    },
    { functional: true, dispatch: false }
  )

};
