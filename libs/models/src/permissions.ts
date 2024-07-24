import { PermissionDefinitionDTO, extractPermissionList, permissionHeirarchy } from './permission-record';
import { Role } from './role';

export const PERMISSION_DEF_DTO: PermissionDefinitionDTO = [
  ['job-post', [
    'create',
    'read',
    ['update', ['details', 'status']],
    'delete'
  ]],
  'gen-ai-vetting',
  'cost-calculator'
];


const permList = extractPermissionList(PERMISSION_DEF_DTO);

export const ALL_PERMISSIONS = new Set(permList);

// this is supposed to be a dev-time helper
export function isPermissionDefined(permission: string) {
  return permission === 'all' || ALL_PERMISSIONS.has(permission);
}

export function isPermissionGranted(permission: string, grants: string[]) {
  const heirarchy = permissionHeirarchy(permission);
  return heirarchy.some(p => grants.includes(p));
}

const roleList: Role[] = [
  {
    id: 'talent',
    permissions: [],
    static: false,
    allowSignup: true,
  },
  {
    id: 'employer',
    permissions: [],
    static: false,
    allowSignup: true,
  },
  {
    id: 'super-admin',
    permissions: ['all'],
    static: true,
    allowSignup: false,
  }
];


export const ALL_ROLES = new Map(roleList.map(r => [r.id, r]));