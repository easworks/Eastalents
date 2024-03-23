import { createActionGroup, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { produce } from 'immer';
import { AdminDataState } from '../models/admin-data';
import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';
import { EASRole } from '../models/eas-role';
import { Domain, DomainModule } from '../models/domain';
import { FeaturedProduct } from '../models/featured';

export const adminDataActions = createActionGroup({
  source: 'admin-data',
  events: {
    'update state': props<{ payload: AdminDataState; }>()
  }
});

export const techSkillActions = createActionGroup({
  source: 'tech-skills',
  events: {
    add: props<{ payload: TechSkill; }>(),
    update: props<{
      payload: {
        id: string;
        name: string;
        generic: boolean;
      };
    }>()
  }
});

export const techGroupActions = createActionGroup({
  source: 'tech-groups',
  events: {
    add: props<{ payload: TechGroup; }>(),
    update: props<{ payload: TechGroup; }>(),
    'add skill': props<{
      payload: {
        group: string;
        skill: string;
      };
    }>(),
    'remove skill': props<{
      payload: {
        group: string;
        skill: string;
      };
    }>()
  }
});

export const easActions = createActionGroup({
  source: 'easRole',
  events: {
    add: props<{ payload: EASRole; }>(),
    update: props<{
      payload: {
        code: string;
        name: string;
      };
    }>()
  }
});

export const softwareProductActions = createActionGroup({
  source: 'software-product',
  events: {
    add: props<{ payload: SoftwareProduct; }>(),
    update: props<{ payload: SoftwareProduct; }>(),
    'add techgroup': props<{
      payload: {
        softwareId: string;
        techgroup: string;
      };
    }>(),
    'remove techgroup': props<{
      payload: {
        group: string;
        techgroup: string;
      };
    }>()
  }
});


export const domainModuleActions = createActionGroup({
  source: 'domain-module',
  events: {
    add: props<{ payload: DomainModule; }>(),
    update: props<{ payload: DomainModule; }>(),
    'add product': props<{
      payload: {
        group: string;
        product: string;
      };
    }>(),
    'remove product': props<{
      payload: {
        group: string;
        product: string;
      };
    }>(),
    'add roles': props<{
      payload: {
        group: string;
        roles: string;
      };
    }>(),
    'remove roles': props<{
      payload: {
        group: string;
        roles: string;
      };
    }>()
  }
});

export const domainActions = createActionGroup({
  source: 'domain',
  events: {
    add: props<{ payload: Domain; }>(),
    update: props<{ payload: Domain; }>(),
    'add product': props<{
      payload: {
        group: string;
        product: string;
      };
    }>(),
    'remove product': props<{
      payload: {
        group: string;
        product: string;
      };
    }>(),
    'add Modules': props<{
      payload: {
        group: string;
        module: string;
      };
    }>(),
    'remove Modules': props<{
      payload: {
        group: string;
        module: string;
      };
    }>(),
  }
});

export const featureProduct = createActionGroup({
  source: 'feature-product',
  events: {
    add: props<{ payload: FeaturedProduct; }>(),
    update: props<{ payload: FeaturedProduct; }>(),
  }
});


export const ADMIN_DATA_FEATURE = createFeature({
  name: 'adminData',
  reducer: createReducer<AdminDataState>(
    {
      skills: [],
      techGroups: [],
      easRoles: [],
      softwareProducts: [],
      domainModules: [],
      domains: [],
      featureProduct: [],
    },
    on(adminDataActions.updateState, (_, { payload }) => {
      return payload;
    }),
    on(techSkillActions.add, produce((state, { payload }) => {
      state.skills.push(payload);
    })),
    on(techSkillActions.update, produce((state, { payload }) => {
      const skill = state.skills.find(s => s.id === payload.id);
      if (!skill)
        throw new Error('tech skill not found');
      Object.assign(skill, payload);
    })),

    //easrole
    on(easActions.add, produce((state, { payload }) => {
      const list = state.easRoles;
      list.push(payload);
    })),
    on(easActions.update, produce((state, { payload }) => {
      const easRole = state.easRoles.find(s => s.code === payload.code);
      if (!easRole)
        throw new Error('EAS Role not found');
      Object.assign(easRole, payload);
    })),

    //Software Product
    on(softwareProductActions.add, produce((state, { payload }) => {
      const list = state.softwareProducts;
      list.push(payload);
    })),
    on(softwareProductActions.update, produce((state, { payload }) => {
      const idx = state.softwareProducts.findIndex(s => s.id === payload.id);
      if (idx < 0)
        throw new Error('software group not found');

      state.softwareProducts[idx] = payload;
    })),

    on(softwareProductActions.addTechgroup, produce((state, { payload }) => {
      const sp = state.softwareProducts.find(s => s.id === payload.softwareId);
      if (!sp)
        throw new Error('software product not found');

      const tg = state.techGroups.find(s => s.id === payload.techgroup);
      if (!tg)
        throw new Error('tech group not found');

      if (tg.generic)
        throw new Error('tech group should not be generic');

      tg.softwareId = sp.id;
      sp.techGroup.push(payload.techgroup);

    })),
    on(softwareProductActions.removeTechgroup, produce((state, { payload }) => {
      const sp = state.softwareProducts.find(s => s.id === payload.group);
      if (!sp)
        throw new Error('software product not found');

      const techgroupIdx = sp.techGroup.findIndex(s => s === payload.techgroup);
      if (techgroupIdx < 0)
        throw new Error('tech group not found');

      sp.techGroup.splice(techgroupIdx, 1);
    })),

    //Feature Product
    on(featureProduct.add, produce((state, { payload }) => {
      const list = state.featureProduct;
      list.push(payload);
    })),
    on(featureProduct.update, produce((state, { payload }) => {
      const domain = state.featureProduct.find(s => s.domain === payload.domain);
      if (!domain)
        throw new Error('Domain not found');
      domain.software = payload.software;
    })),

    //Domain Module
    on(domainModuleActions.add, produce((state, { payload }) => {
      const list = state.domainModules;
      list.push(payload);
    })),
    on(domainModuleActions.update, produce((state, { payload }) => {
      const domainModule = state.domainModules.find(s => s.id === payload.id);
      if (!domainModule)
        throw new Error('Domain Module not found');
      Object.assign(domainModule, payload);
    })),

    on(domainModuleActions.addProduct, produce((state, { payload }) => {
      const dm = state.domainModules.find(s => s.id === payload.group);
      if (!dm)
        throw new Error('domain module not found');

      const sp = state.softwareProducts.find(s => s.id === payload.product);
      if (!sp)
        throw new Error('software product not found');

      dm.products.push(payload.product);
    })),
    on(domainModuleActions.removeProduct, produce((state, { payload }) => {
      const dm = state.domainModules.find(s => s.id === payload.group);
      if (!dm)
        throw new Error('domain module not found');

      const softwareProductIdx = dm.products.findIndex(s => s === payload.product);
      if (softwareProductIdx < 0)
        throw new Error('software product not found');

      dm.products.splice(softwareProductIdx, 1);
    })),

    on(domainModuleActions.addRoles, produce((state, { payload }) => {
      const dm = state.domainModules.find(s => s.id === payload.group);
      if (!dm)
        throw new Error('domain module not found');

      const sp = state.easRoles.find(s => s.code === payload.roles);
      if (!sp)
        throw new Error('eas roles not found');

      dm.roles.push(payload.roles);
    })),
    on(domainModuleActions.removeRoles, produce((state, { payload }) => {
      const dm = state.domainModules.find(s => s.id === payload.group);
      if (!dm)
        throw new Error('domain module not found');

      const easRolesIdx = dm.roles.findIndex(s => s === payload.roles);
      if (easRolesIdx < 0)
        throw new Error('software product not found');

      dm.roles.splice(easRolesIdx, 1);
    })),


    //domain 
    on(domainActions.add, produce((state, { payload }) => {
      const list = state.domains;
      list.push(payload);
    })),
    on(domainActions.update, produce((state, { payload }) => {
      const idx = state.domains.findIndex(s => s.id === payload.id);
      if (idx < 0)
        throw new Error('domains  not found');

      state.domains[idx] = payload;
    })),
    on(domainActions.addProduct, produce((state, { payload }) => {
      const domains = state.domains.find(s => s.id === payload.group);
      if (!domains)
        throw new Error('domains not found');

      const sp = state.softwareProducts.find(s => s.id === payload.product);
      if (!sp)
        throw new Error('software product not found');

      domains.products.push(payload.product);
    })),
    on(domainActions.removeProduct, produce((state, { payload }) => {
      const domains = state.domains.find(s => s.id === payload.group);
      if (!domains)
        throw new Error('domains not found');

      const softwareProductIdx = domains.products.findIndex(s => s === payload.product);
      if (softwareProductIdx < 0)
        throw new Error('software product not found');

      domains.products.splice(softwareProductIdx, 1);
    })),
    on(domainActions.addModules, produce((state, { payload }) => {
      const domains = state.domains.find(s => s.id === payload.group);
      if (!domains)
        throw new Error('domains not found');

      const dm = state.domainModules.find(s => s.id === payload.module);
      if (!dm)
        throw new Error('domain modules not found');

      domains.modules.push(payload.module);
    })),
    on(domainActions.removeModules, produce((state, { payload }) => {
      const domains = state.domains.find(s => s.id === payload.group);
      if (!domains)
        throw new Error('domains not found');

      const domainModuleIdx = domains.modules.findIndex(s => s === payload.module);
      if (domainModuleIdx < 0)
        throw new Error('domain modules not found');

      domains.modules.splice(domainModuleIdx, 1);
    })),
    // tech groups
    on(techGroupActions.add, produce((state, { payload }) => {
      const list = state.techGroups;
      list.push(payload);
    })),
    on(techGroupActions.update, produce((state, { payload }) => {
      const idx = state.techGroups.findIndex(s => s.id === payload.id);
      if (idx < 0)
        throw new Error('tech group not found');

      state.techGroups[idx] = payload;
    })),
    on(techGroupActions.addSkill, produce((state, { payload }) => {
      const tg = state.techGroups.find(s => s.id === payload.group);
      if (!tg)
        throw new Error('tech group not found');

      const skill = state.skills.find(s => s.id === payload.skill);
      if (!skill)
        throw new Error('tech skill not found');

      tg.tech.push(payload.skill);
    })),
    on(techGroupActions.removeSkill, produce((state, { payload }) => {
      const tg = state.techGroups.find(s => s.id === payload.group);
      if (!tg)
        throw new Error('tech group not found');

      const skillIdx = tg.tech.findIndex(s => s === payload.skill);
      if (skillIdx < 0)
        throw new Error('tech skill not found');

      tg.tech.splice(skillIdx, 1);
    }))
  ),
  extraSelectors: (base) => ({//where to use
    techSkillMap: createSelector(
      base.selectSkills,
      list => new Map(list.map(skill => [skill.id, skill]))
    )
  })
});
