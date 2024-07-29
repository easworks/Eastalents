import { createActionGroup, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { produce } from 'immer';
import { extractPermissionList, PermissionDefinitionDTO, PermissionRecord } from 'models/permission-record';
import { ALL_ROLES } from 'models/permissions';
import { User } from 'models/user';

export const CURRENT_USER_KEY = 'currentUser' as const;

export interface AuthUser {
  _id: string;

  displayName: string | null;
  imageUrl: string | null;

  email: string | null;

  roles: Set<string>;
  permissions: Set<string>;
}

export function getAuthUserFromModel(
  user: User, permissionRecord: PermissionRecord
) {
  const roles = permissionRecord.roles
    .map(id => ALL_ROLES.get(id))
    .filter(r => !!r);

  const permissions = permissionRecord.permissions
    .concat(roles.map(r => r.permissions).flat());

  const authUser: AuthUser = {
    _id: user._id,
    displayName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    imageUrl: user.imageUrl,
    roles: new Set(roles.map(r => r.id)),
    permissions: new Set(permissions),
  };

  return authUser;
}


interface AuthState {
  ready: boolean;
  user: AuthUser | null;

  /** all permissions */
  permissions: ReadonlySet<string>;
}

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    'id token updated': props<{ payload: { token: string; }; }>(),
    'update permission definition': props<{ dto: PermissionDefinitionDTO; }>(),
    'update user': props<{
      payload: {
        user: AuthUser | null;
      };
    }>(),
    'sign in': props<{
      payload: {
        needsOnboarding: boolean;
        returnUrl: string | null;
      };
    }>(),
    'sign out': props<{ payload: { revoked: boolean; }; }>()
  }
});

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer<AuthState>(
    {
      ready: false,
      user: null,
      permissions: new Set(),
    },

    on(authActions.updatePermissionDefinition, produce((state, { dto }) => {
      state.permissions = new Set(extractPermissionList(dto));
    })),

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

