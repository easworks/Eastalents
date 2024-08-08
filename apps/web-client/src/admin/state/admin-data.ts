import { sortString } from '@easworks/app-shell/utilities/sort';
import { createEntityAdapter } from '@ngrx/entity';
import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { produce } from 'immer';
import { AdminDataDTO, AdminDataState } from '../models/admin-data';
import { Domain } from '../models/domain';
import { SoftwareProduct, TechGroup, TechSkill } from '../models/tech-skill';

export const adminDataActions = createActionGroup({
  source: 'admin-data',
  events: {
    'update state': props<{ payload: AdminDataDTO; }>(),
    'save state': emptyProps()
  }
});

export const techSkillActions = createActionGroup({
  source: 'tech-skills',
  events: {
    add: props<{ payload: TechSkill; }>(),
    update: props<{ payload: TechSkill; }>(),
    'update groups': props<{
      payload: {
        id: string;
        groups: TechSkill['groups'];
      };
    }>()
  }
});

export const techGroupActions = createActionGroup({
  source: 'tech-groups',
  events: {
    add: props<{ payload: TechGroup; }>(),
    update: props<{ payload: { id: string; name: string; }; }>(),
    'update skills': props<{
      payload: {
        id: string;
        skills: TechGroup['skills'];
      };
    }>()
  }
});

export const softwareProductActions = createActionGroup({
  source: 'software-product',
  events: {
    'add': props<{ payload: SoftwareProduct; }>(),
    'update': props<{ payload: SoftwareProduct; }>(),
    'update skills': props<{
      payload: {
        id: string;
        skills: SoftwareProduct['skills'];
      };
    }>(),
    'update domains': props<{
      payload: {
        id: string;
        domains: SoftwareProduct['domains'];
      };
    }>()
  }
});


const adapters = {
  domain: createEntityAdapter<Domain>(),
  techSkill: createEntityAdapter<TechSkill>(),
  softwareProduct: createEntityAdapter<SoftwareProduct>(),
  techGroup: createEntityAdapter<TechGroup>(),
} as const;

const feature = createFeature({
  name: 'adminData',
  reducer: createReducer<AdminDataState>(
    {
      domains: adapters.domain.getInitialState(),
      techSkills: adapters.techSkill.getInitialState(),
      softwareProducts: adapters.softwareProduct.getInitialState(),
      techGroups: adapters.techGroup.getInitialState(),
      featuredDomains: [],
    },

    on(adminDataActions.updateState, (state, { payload }) => {
      state = {
        domains: adapters.domain.getInitialState(),
        softwareProducts: adapters.softwareProduct.getInitialState(),
        techGroups: adapters.techGroup.getInitialState(),
        techSkills: adapters.techSkill.getInitialState(),
        featuredDomains: []
      };

      state.domains = adapters.domain.setMany(payload.domains, state.domains);
      state.softwareProducts = adapters.softwareProduct.setMany(
        payload.softwareProducts.map(p => ({ ...p, domains: [] })),
        state.softwareProducts);
      state.techSkills = adapters.techSkill.setMany(payload.techSkills, state.techSkills);
      state.techGroups = adapters.techGroup.setMany(
        payload.techGroups.map(g => ({ ...g, skills: [] })),
        state.techGroups);

      for (const skill of payload.techSkills) {
        for (const id of skill.groups) {
          const group = state.techGroups.entities[id];
          if (!group)
            throw new Error('invalid operation');
          group.skills.push(skill.id);
        }
      }

      for (const domain of payload.domains) {
        for (const id of domain.products) {
          const product = state.softwareProducts.entities[id];
          if (!product)
            throw new Error('invalid operation');
          product.domains.push(domain.id);
        }
      }

      return state;
    }),

    // Software Product
    on(softwareProductActions.add, (state, { payload }) => {
      state = { ...state };
      state.softwareProducts = adapters.softwareProduct.addOne(payload, state.softwareProducts);
      (state.softwareProducts.ids as string[]).sort(sortString);
      return state;
    }),
    on(softwareProductActions.update, (state, { payload }) => {
      state = { ...state };
      state.softwareProducts = adapters.softwareProduct.setOne(payload, state.softwareProducts);
      return state;
    }),
    on(softwareProductActions.updateSkills, (state, { payload }) => {
      state = { ...state };

      state.softwareProducts = adapters.softwareProduct.mapOne({
        id: payload.id,
        map: product => {
          product = { ...product };
          product.skills = {};
          for (const group in payload.skills) {
            if (payload.skills[group].length > 0) {
              product.skills[group] = payload.skills[group];
            }
          }
          return product;
        }
      }, state.softwareProducts);

      return state;
    }),
    on(softwareProductActions.updateDomains, produce((state, { payload }) => {
      const product = state.softwareProducts.entities[payload.id];
      if (!product)
        throw new Error('invalid operation');

      // update domain
      {
        const { added, removed } = diffList(product.domains, payload.domains);

        added
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.domains.entities[id]!)
          .forEach(domain => utils.domains.addProduct(domain, product));


        removed
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.domains.entities[id]!)
          .forEach(domain => utils.domains.removeProduct(domain, product));
      }

      // update software product
      product.domains = [...payload.domains].sort(sortString);

      return state;
    })),

    // Tech Skills
    on(techSkillActions.add, (state, { payload }) => {
      state = { ...state };
      state.techSkills = adapters.techSkill.addOne(payload, state.techSkills);
      (state.techSkills.ids as string[]).sort(sortString);
      return state;
    }),
    on(techSkillActions.update, (state, { payload }) => {
      state = { ...state };
      state.techSkills = adapters.techSkill.setOne(payload, state.techSkills);
      return state;
    }),

    on(techSkillActions.updateGroups, produce((state, { payload }) => {
      const skill = state.techSkills.entities[payload.id];
      if (!skill)
        throw new Error('invalid operation');

      // update tech groups
      {
        const { added, removed } = diffList(skill.groups, payload.groups);

        added
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.techGroups.entities[id]!)
          .forEach(group => utils.techGroup.addSkill(skill, group));

        removed
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.techGroups.entities[id]!)
          .forEach(group => utils.techGroup.removeSkill(skill, group));

      }

      // update tech skill
      skill.groups = [...payload.groups].sort(sortString);

      return state;
    })),

    // Tech Groups
    on(techGroupActions.add, (state, { payload }) => {
      state = { ...state };
      state.techGroups = adapters.techGroup.addOne(payload, state.techGroups);
      (state.techGroups.ids as string[]).sort(sortString);
      return state;
    }),
    on(techGroupActions.update, (state, { payload }) => {
      state = { ...state };
      state.techGroups = adapters.techGroup.mapOne({
        id: payload.id,
        map: group => {
          group = { ...group };
          group.name = payload.name;
          return group;
        },
      }, state.techGroups);
      return state;
    }),
    on(techGroupActions.updateSkills, produce((state, { payload }) => {
      const group = state.techGroups.entities[payload.id];
      if (!group)
        throw new Error('invalid operation');

      // update tech skills 
      {
        const { added, removed } = diffList(group.skills, payload.skills);

        added
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.techSkills.entities[id]!)
          .forEach(skill => utils.techSkill.addGroup(group, skill));
        removed
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.techSkills.entities[id]!)
          .forEach(skill => utils.techSkill.removeGroup(group, skill));

      }

      // update tech group
      group.skills = [...payload.skills].sort(sortString);

    }))
  ),
  extraSelectors: base => {
    const selectors = {
      domain: adapters.domain.getSelectors(),
      softwareProduct: adapters.softwareProduct.getSelectors(),
      techSkill: adapters.techSkill.getSelectors(),
      techGroup: adapters.techGroup.getSelectors(),
    };

    return {
      selectDto: createSelector(
        base.selectAdminDataState,
        (state): AdminDataDTO => ({
          domains: selectors.domain.selectAll(state.domains),
          techSkills: selectors.techSkill.selectAll(state.techSkills),
          softwareProducts: selectors.softwareProduct.selectAll(state.softwareProducts),
          techGroups: selectors.techGroup.selectAll(state.techGroups)
            .map(({ skills, ...rest }) => rest),
        })
      )
    };
  }
});

export const adminData = {
  adapters,
  feature,
  selectors: {
    domains: adapters.domain.getSelectors(feature.selectDomains),
    softwareProduct: adapters.softwareProduct.getSelectors(feature.selectSoftwareProducts),
    techSkill: adapters.techSkill.getSelectors(feature.selectTechSkills),
    techGroup: adapters.techGroup.getSelectors(feature.selectTechGroups),
  }
} as const;


const utils = {
  domains: {
    addProduct: (domain: Domain, product: SoftwareProduct) => {
      domain.products.push(product.id);
      domain.products.sort(sortString);
    },
    removeProduct: (domain: Domain, product: SoftwareProduct) => {
      const idx = domain.products.findIndex(s => s === product.id);
      if (idx !== -1)
        domain.products.splice(idx, 1);
    },
  },
  techGroup: {
    addSkill: (skill: TechSkill, group: TechGroup) => {
      group.skills.push(skill.id);
      group.skills.sort(sortString);
    },
    removeSkill: (skill: TechSkill, group: TechGroup) => {
      const idx = group.skills.findIndex(s => s === skill.id);
      if (idx !== -1)
        group.skills.splice(idx, 1);
    }
  },
  techSkill: {
    addGroup: (group: TechGroup, skill: TechSkill) => {
      skill.groups.push(group.id);
      skill.groups.sort(sortString);
    },
    removeGroup: (group: TechGroup, skill: TechSkill) => {
      const idx = skill.groups.findIndex(g => g === group.id);
      if (idx !== -1)
        skill.groups.splice(idx, 1);
    }
  }
} as const;


function diffList<T>(from: readonly T[], to: readonly T[]) {
  const prev = new Set(from);
  const next = new Set(to);

  const added = new Set<T>();
  const removed = new Set<T>();

  for (const p of from) {
    if (!next.has(p))
      removed.add(p);
  }

  for (const n of to) {
    if (!prev.has(n))
      added.add(n);
  }

  return {
    added: [...added],
    removed: [...removed],
  } as const;
}