import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';
import { produce } from 'immer';
import { AdminDataState } from '../models/admin-data';
import { TechSkill } from '../models/tech-skill';

export const adminDataActions = createActionGroup({
  source: 'admin-data',
  events: {
    'update state': props<{ payload: AdminDataState; }>()
  }
});

export const techSkillActions = createActionGroup({
  source: 'tech-skills',
  events: {
    add: props<{ payload: TechSkill; }>()
  }
});

export const ADMIN_DATA_FEATURE = createFeature({
  name: 'adminData',
  reducer: createReducer<AdminDataState>(
    {
      skills: []
    },
    on(adminDataActions.updateState, (_, { payload }) => {
      return payload;
    }),
    on(techSkillActions.add, produce((state, { payload }) => {
      state.skills.push(payload);

      console.debug(state);
    }))
  )
});
