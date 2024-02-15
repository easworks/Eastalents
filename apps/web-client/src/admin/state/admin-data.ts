import { createActionGroup, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { produce } from 'immer';
import { AdminDataState } from '../models/admin-data';
import { TechGroup, TechSkill } from '../models/tech-skill';
import { EASRole } from '../models/eas-role';

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


export const ADMIN_DATA_FEATURE = createFeature({
  name: 'adminData',
  reducer: createReducer<AdminDataState>(
    {
      skills: [],
      techGroups: [],
      easRole: []
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
      const list = state.easRole;
      list.push(payload);
    })),
    on(easActions.update, produce((state, { payload }) => {
      const easRole = state.easRole.find(s => s.code === payload.code);
      if (!easRole)
        throw new Error('EAS Role not found');
      Object.assign(easRole, payload);
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

      const skillIdx = state.skills.findIndex(s => s.id === payload.skill);
      if (skillIdx < 0)
        throw new Error('tech skill not found');

      tg.tech.splice(skillIdx, 1);
    }))
  ),
  extraSelectors: (base) => ({
    techSkillMap: createSelector(
      base.selectSkills,
      list => new Map(list.map(skill => [skill.id, skill]))
    )
  })
});
