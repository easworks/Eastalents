import { PermissionRecord } from '../permission-record';
import { User } from '../user';

export interface UserSelfOutput {
  user: User;
  permissionRecord: PermissionRecord;
}