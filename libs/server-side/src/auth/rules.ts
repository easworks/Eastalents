import { permissionHeirarchy } from 'models/permission-record';
import { isPermissionDefined } from 'models/permissions';
import { AuthenticatedCloudContext } from '../context';

export type AuthValidator = (ctx: AuthenticatedCloudContext) => boolean;

const cache = {
  hasPermission: new Map<string, AuthValidator>(),
} as const;

export const authRules = {
  hasPermission: (permission: string) => {
    {
      const cached = cache.hasPermission.get(permission);
      if (cached) return cached;
    }

    if (!isPermissionDefined(permission))
      throw new Error(`permission '${permission}' is not defined`);

    const allowList = permissionHeirarchy(permission);

    const validator: AuthValidator = ({ auth }) => allowList.some(permission => auth.permissions.has(permission));

    cache.hasPermission.set(permission, validator);
    return validator;
  },
} as const satisfies Record<string, (...args: any[]) => AuthValidator>;