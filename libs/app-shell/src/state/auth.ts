import { createActionGroup, createFeature, createReducer, createSelector, props } from '@ngrx/store';
import { PermissionDefinitionDTO } from 'models/permission-record';
import { UserWithToken } from 'models/user';

export const CURRENT_USER_KEY = 'currentUser' as const;

interface State {
  ready: boolean;
  user: UserWithToken | null;
  permissions: string[];
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
      permissions: [],
    },

    // on(authActions.updatePermissionDefinition, produce((state, { dto }) => {
    //   state.allPermissions = new Set(extractPermissionList(dto));
    // })),

    // on(authActions.updateUser, (state, { payload }) => {
    //   state = { ...state };
    //   state.ready = true;
    //   state.user = payload.user;

    //   if (state.user) {
    //     const role = ALL_ROLES.get(state.user.role);

    //     if (role) {
    //       state.permissions = role.permissions;
    //     }
    //     else {
    //       console.error(`role '${state.user.role}' was not defined`);
    //       state.permissions = [];
    //     }
    //   }
    //   else {
    //     state.permissions = [];
    //   }

    //   return state;
    // }),

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

