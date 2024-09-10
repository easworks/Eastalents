import { ALL_ROLES, isPermissionDefined, isPermissionGranted } from 'models/permissions';
import { CloudUser } from '../context';

export type AuthValidator = (user: CloudUser) => boolean;

const cache = {
  hasPermission: new Map<string, AuthValidator>(),
  hasRole: new Map<string, AuthValidator>(),
} as const;

export const authRules = {
  hasRole: (role: string) => {
    {
      const cached = cache.hasRole.get(role);
      if (cached) return cached;
    }

    const foundRole = ALL_ROLES.get(role);
    if (!foundRole) {
      throw new Error(`role '${role}' is not defined`);
    }

    const validator: AuthValidator = (user) => user.roles.has(role);

    cache.hasRole.set(role, validator);
    return validator;
  },
  hasPermission: (permission: string) => {
    {
      const cached = cache.hasPermission.get(permission);
      if (cached) return cached;
    }

    if (!isPermissionDefined(permission))
      throw new Error(`permission '${permission}' is not defined`);

    const validator: AuthValidator = (user) => isPermissionGranted(permission, user.permissions);

    cache.hasPermission.set(permission, validator);
    return validator;
  },
} as const satisfies Record<string, (...args: any[]) => AuthValidator>;