import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map, switchMap, zip } from 'rxjs';
import { AdminApi } from '../api/admin.api';
import { DomainsApi } from '../api/domains.api';
import { isBrowser } from '../utilities/platform-type';
import { domainActions, domainData, domainDataActions, featuredDomainActions, softwareProductActions, techGroupActions, techSkillActions } from './domain-data';

export const domainDataEffects = {
  loadFromApi: createEffect(
    () => {
      const api = inject(DomainsApi);

      const data$ = zip(
        api.data.get(),
        api.industries(),
        api.featured.get()
      )
        .pipe(map(([domainDto, industries, featured]) => Object.assign(domainDto, { industries, featured })));

      if (isBrowser())
        return data$
          .pipe(
            switchMap(payload => [
              domainDataActions.updateState({ payload }),
              domainDataActions.saveState()
            ])
          );
      else
        return data$
          .pipe(
            switchMap(payload => [
              domainDataActions.updateState({ payload })
            ])
          );


      // const data = Promise.all([
      //   api.domains.read(),
      //   api.softwareProducts.read(),
      //   api.techSkills.read(),
      //   api.techGroups.read(),
      // ]).then<DomainDataDTO>(results => ({
      //   domains: results[0],
      //   softwareProducts: results[1],
      //   techSkills: results[2],
      //   techGroups: results[3]
      // }));
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

      // return from(data)
      //   .pipe(
      //     map(payload => domainDataActions.updateState({ payload: payload }))
      //   );
    },
    { functional: true }
  ),

  saveDomains: createEffect(
    () => {
      const api = inject(AdminApi);
      const actions$ = inject(Actions);
      const store = inject(Store);

      const list$ = store.selectSignal(domainData.selectors.domains.selectAll);

      return actions$.pipe(
        ofType(
          domainDataActions.saveState,
          domainActions.add,
          domainActions.update,
          domainActions.updateModules,
          domainActions.updateRoles,
          domainActions.updateServices
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

      const list$ = store.selectSignal(domainData.selectors.softwareProduct.selectAll);

      return actions$.pipe(
        ofType(
          domainDataActions.saveState,
          softwareProductActions.add,
          softwareProductActions.update,
          softwareProductActions.updateSkills
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

      const list$ = store.selectSignal(domainData.selectors.techSkill.selectAll);

      return actions$.pipe(
        ofType(
          domainDataActions.saveState,
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

      const list$ = store.selectSignal(domainData.selectors.techGroup.selectAll);

      return actions$.pipe(
        ofType(
          domainDataActions.saveState,
          techGroupActions.add,
          techGroupActions.update,

        ),
        concatMap(() => api.techGroups.write(list$()))
      );
    },
    { functional: true, dispatch: false }
  ),

  saveFeaturedDomains: createEffect(
    () => {
      const api = inject(AdminApi);
      const actions$ = inject(Actions);

      const store = inject(Store);

      const list$ = store.selectSignal(domainData.selectors.featuredDomains);

      return actions$.pipe(
        ofType(
          domainDataActions.saveState,
          featuredDomainActions.add,
        ),
        concatMap(() => api.featuredDomains.write(list$()))
      );
    },
    { functional: true, dispatch: false })

};
