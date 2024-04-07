import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, from, map } from 'rxjs';
import { AdminApi } from '../api/admin.api';
import { ADMIN_DATA_FEATURE, adminDataActions, domainActions, domainModuleActions, easActions, featuredProductActions, featuredRolesActions, softwareProductActions, techGroupActions, techSkillActions } from './admin-data';

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
          techSkillActions.update,
          techGroupActions.add,
          techGroupActions.update,
          techGroupActions.addSkill,
          techGroupActions.removeSkill,
          easActions.add,
          easActions.update,

          softwareProductActions.add,
          softwareProductActions.update,
          softwareProductActions.addTechgroup,
          softwareProductActions.removeTechgroup,

          domainModuleActions.add,
          domainModuleActions.update,
          domainModuleActions.addProduct,
          domainModuleActions.removeProduct,
          domainModuleActions.addRoles,
          domainModuleActions.removeRoles,

          domainActions.add,
          domainActions.update,
          domainActions.addProduct,
          domainActions.removeProduct,
          domainActions.addModules,
          domainActions.removeModules,
          domainActions.addServices,
          domainActions.removeServices,

          featuredProductActions.addDomain,
          featuredProductActions.removeDomain,
          featuredProductActions.updateProducts,

          featuredRolesActions.addDomain,
          featuredRolesActions.removeDomain,
          featuredRolesActions.updateRoles

        ),
        concatMap(async () => {
          await api.save(data$());
        })
      );
  }, { functional: true, dispatch: false })
};
