import { PermissionDefinitionDTO, extractPermissionList } from '@easworks/models/permission-record';
import { Role } from '@easworks/models/role';

export const PERMISSION_DEF_DTO: PermissionDefinitionDTO = [
  'freelancer',
  'employer',
  ['job-post', [
    'create',
    'read',
    ['update', ['details', 'status']],
    'delete'
  ]]
];


const permList = extractPermissionList(PERMISSION_DEF_DTO);

export const ALL_PERMISSIONS = new Set(permList);

// this supposed to be a dev-time helper
export function isPermissionDefined(permission: string) {
  return permission === 'all' || ALL_PERMISSIONS.has(permission);
}

const roleList: Role[] = [
  {
    id: 'freelancer',
    permissions: ['freelancer'],
    static: true
  },
  {
    id: 'employer',
    permissions: [
      'employer',
      'job-post.create',
      'job-post.read',
      'job-post.update.details'
    ],
    static: true
  },
  {
    id: 'admin',
    permissions: [
      'job-post.read',
      'job-post.delete',
    ],
    static: true
  },
  {
    id: 'super-admin',
    permissions: ['all'],
    static: true
  }
];

roleList.forEach(role => role.permissions.forEach(p => {
  if (!isPermissionDefined(p))
    throw new Error(`permission '${p}' is not defined`);
}));

export const ALL_ROLES = new Map(roleList.map(r => [r.id, r]));