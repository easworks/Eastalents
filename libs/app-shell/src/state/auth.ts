import { UserWithToken } from '@easworks/models';
import { PermissionDefinitionDTO, extractPermissionList } from '@easworks/models/permission-record';
import { createActionGroup, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { produce } from 'immer';

export const CURRENT_USER_KEY = 'currentUser' as const;

interface State {
  ready: boolean;
  user: UserWithToken | null;
  permissions: ReadonlySet<string>;
  allPermissions: ReadonlySet<string>;
}

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    'update permission definition': props<{ dto: PermissionDefinitionDTO; }>(),
    'update user': props<{ payload: { user: UserWithToken | null; }; }>(),
    'sign in': props<{
      payload: {
        returnUrl?: string;
      };
    }>(),
    'sign out': props<{ payload: { revoked: boolean; }; }>()
  }
});

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer<State>(
    {
      ready: false,
      allPermissions: new Set(),
      user: null,
      permissions: new Set(),
    },

    on(authActions.updatePermissionDefinition, produce((state, { dto }) => {
      state.permissions = new Set(extractPermissionList(dto));
    })),

    on(authActions.updateUser, (state, { payload }) => {
      state = { ...state };
      state.ready = true;
      state.user = payload.user;
      return state;
    }),

  ),
  extraSelectors: (base) => ({
    guaranteedUser: createSelector(
      base.selectUser,
      user => {
        if (!user)
          throw new Error('user was guaranteed');
        return user;
      }
    )
  })
})

