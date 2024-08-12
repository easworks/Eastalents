import { createActionGroup, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { PermissionRecord } from 'models/permission-record';
import { ALL_ROLES, isPermissionDefined, isPermissionGranted } from 'models/permissions';
import { User } from 'models/user';

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
    'id token changed': props<{
      payload: {
        token: string | null;
        loadUser?: boolean;
      };
    }>(),
    'update user': props<{
      payload: {
        user: AuthUser | null;
      };
    }>(),
    'sign in': props<{
      payload: {
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
});

export type AuthValidator = (user: AuthUser) => boolean;

export const AUTH_CHECKS = {
  combine: {
    all: (validators: AuthValidator[]) => {
      const validator: AuthValidator = (user) => validators.every(v => v(user));
      return validator;
    },
    any: (validators: AuthValidator[]) => {
      const validator: AuthValidator = (user) => validators.some(v => v(user));
      return validator;
    }
  },
  hasRole: (() => {
    const cache = new Map<string, AuthValidator>();

    const single = (role: string) => {
      {
        const cached = cache.get(role);
        if (cached) return cached;
      }

      const foundRole = ALL_ROLES.get(role);
      if (!foundRole) {
        throw new Error(`role '${role}' is not defined`);
      }

      const validator: AuthValidator = (user) => user.roles.has(role);

      cache.set(role, validator);
      return validator;
    };

    const all = (roles: string[]) => {
      const mapped = roles.map(single);
      return AUTH_CHECKS.combine.all(mapped);
    };

    const any = (roles: string[]) => {
      const mapped = roles.map(single);
      return AUTH_CHECKS.combine.any(mapped);
    };

    return Object.assign(
      single, { all, any }
    );
  })(),
  hasPermission: (() => {
    const cache = new Map<string, AuthValidator>();

    const single = (permission: string) => {
      {
        const cached = cache.get(permission);
        if (cached) return cached;
      }

      // validate the permission string
      if (!isPermissionDefined(permission))
        throw new Error(`a route uses a permission '${permission}' which is not defined`);

      const validator: AuthValidator = (user) => isPermissionGranted(permission, user.permissions);

      cache.set(permission, validator);
      return validator;
    };

    const all = (permission: string[]) => {
      const mapped = permission.map(single);
      return AUTH_CHECKS.combine.all(mapped);
    };

    const any = (permission: string[]) => {
      const mapped = permission.map(single);
      return AUTH_CHECKS.combine.any(mapped);
    };

    return Object.assign(
      single, { all, any }
    );
  })()
} as const;



