import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';
import { AdminDataState } from '../models/admin-data';

export const adminDataActions = createActionGroup({
  source: 'admin-data',
  events: {
    'update state': props<{ payload: AdminDataState; }>()
  }
});

export const ADMIN_DATA_FEATURE = createFeature({
  name: 'admin-data',
  reducer: createReducer<AdminDataState>(
    {
      skills: []
    },
    on(adminDataActions.updateState, (_, { payload }) => {
      return payload;
    })
  )
});
