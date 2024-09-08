import { User } from './user';

export interface PermissionRecord {
  user: User;
  permissions: string[];
  roles: string[];
}
