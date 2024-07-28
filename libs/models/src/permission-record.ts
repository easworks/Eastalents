import { Entity } from './entity';

export interface PermissionRecord extends Entity {
  permissions: string[];
  roles: string[];
}

export type PermissionDefinitionDTO = (string | [string, PermissionDefinitionDTO])[];

export function extractPermissionList(input: PermissionDefinitionDTO): string[] {
  return input
    .map(item => {
      if (typeof item === 'string') return [item];

      const [parent, descendant] = item;

      return extractPermissionList(descendant)
        .map(d => `${parent}.${d}`);
    })
    .flat();
}

const heirarchyCache = new Map<string, string[]>();

/** Given a particular permission, 
 * returns all the permission strings 
 * that would allow the input permission
 *  
 * For example: `users.read.list` =>
 * `[ 'all', 'users', 'users.read', 'users.read.list' ]`*/
export function permissionHeirarchy(permission: string) {
  const cached = heirarchyCache.get(permission);
  if (cached) return cached;

  const arr = ['all'];
  const parts = permission.split('.');
  for (let i = 0; i < parts.length; i++) {
    arr.push(parts.slice(0, i + 1).join('.'));
  }

  heirarchyCache.set(permission, arr);
  return arr;
}
