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
  }
});

export const softwareProductActions = createActionGroup({
  source: 'software-product',
  events: {
    'add': props<{ payload: SoftwareProduct; }>(),
    'update': props<{ payload: SoftwareProduct; }>()
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
      state.softwareProducts = adapters.softwareProduct.setMany(payload.softwareProducts, state.softwareProducts);
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
        const prev = new Set(skill.groups);
        const next = new Set(payload.groups);

        const added = new Set<string>();
        const removed = new Set<string>();

        for (const p of skill.groups) {
          if (!next.has(p))
            removed.add(p);
        }

        for (const n of payload.groups) {
          if (!prev.has(n))
            added.add(n);
        }

        [...added]
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.techGroups.entities[id]!)
          .forEach(group => techGroupUtils.addSkill(skill, group));

        [...removed]
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(id => state.techGroups.entities[id]!)
          .forEach(group => techGroupUtils.removeSkill(skill, group));

      }

      // update tech skill
      skill.groups = [...payload.groups].sort((a, b) => sortString(a[0], b[0]));

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
    })
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


const techGroupUtils = {
  addSkill: (skill: TechSkill, group: TechGroup) => {
    group.skills.push(skill.id);
    group.skills.sort(sortString);
  },
  removeSkill: (skill: TechSkill, group: TechGroup) => {
    const idx = group.skills.findIndex(s => s === skill.id);
    if (idx !== -1)
      group.skills.splice(idx, 1);
  }
} as const;
