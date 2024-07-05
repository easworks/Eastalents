import { PermissionDefinitionDTO, extractPermissionList, permissionHeirarchy } from '@easworks/models/permission-record';
import { Role } from '@easworks/models/role';

export const PERMISSION_DEF_DTO: PermissionDefinitionDTO = [
  ['role', ['freelancer', 'employer', 'admin']],
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
    id: 'freelancer',
    permissions: [
      'role.freelancer',
      'gen-ai-vetting'
    ],
    static: false
  },
  {
    id: 'employer',
    permissions: [
      'role.employer',
      'job-post.create',
      'job-post.read',
      'job-post.update.details',
      'cost-calculator'
    ],
    static: false
  },
  {
    id: 'admin',
    permissions: [
      'role.admin',
      'job-post.read',
      'job-post.delete',
    ],
    static: false
  },
  {
    id: 'super-admin',
    permissions: ['all'],
    static: true
  }
];


export const ALL_ROLES = new Map(roleList.map(r => [r.id, r]));