import { createActionGroup, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { PermissionRecord } from 'models/permission-record';
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


export interface AuthState {
  ready: boolean;
  user: AuthUser | null;
}

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    'id token updated': props<{ payload: { token: string; }; }>(),
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
    },

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

