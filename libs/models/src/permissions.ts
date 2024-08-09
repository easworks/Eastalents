import { Role } from './role';

export const PERMISSION_DEF_DTO: PermissionDefinitionDTO = [
  ['migration', ['export', 'import']],

  ['job-post', [
    'create',
    'read', // even public everybody has this, honestly
    ['update', ['details', 'status']],
    'delete'
  ]],

  ['job-post-application', [
    'create'
  ]],

  'gen-ai-vetting',
  'cost-calculator'
];


const permList = extractPermissionList(PERMISSION_DEF_DTO);

export const ALL_PERMISSIONS = new Set(permList);

const roleList: Role[] = [
  {
    id: 'talent',
    permissions: [
      'job-post-application.create'
    ],
    static: false,
    allowSignup: true,
  },
  {
    id: 'employer',
    permissions: [
      'job-post.create',
      'job-post.update.details'
    ],
    static: false,
    allowSignup: true,
  },
  {
    id: 'admin',
    permissions: [
      'job-post.update.status'
    ],
    static: false,
    allowSignup: false
  },
  {
    id: 'super-admin',
    permissions: ['all'],
    static: true,
    allowSignup: false,
  }
];


export const ALL_ROLES = new Map(roleList.map(r => [r.id, r]));

export type PermissionDefinitionDTO = (string | [string, PermissionDefinitionDTO])[];

function extractPermissionList(input: PermissionDefinitionDTO): string[] {
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
function permissionHeirarchy(permission: string) {
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

// this is supposed to be a dev-time helper
export function isPermissionDefined(permission: string) {
  return permission === 'all' || ALL_PERMISSIONS.has(permission);
}

export function isPermissionGranted(permission: string, grants: Set<string>) {
  const heirarchy = permissionHeirarchy(permission);
  return heirarchy.some(p => grants.has(p));
}
