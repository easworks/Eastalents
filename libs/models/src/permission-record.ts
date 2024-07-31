import { Entity } from './entity';

export interface PermissionRecord extends Entity {
  permissions: string[];
  roles: string[];
}
