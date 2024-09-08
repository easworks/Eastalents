import { PermissionRecord } from '@easworks/models/permission-record';
import { User } from '@easworks/models/user';
import { EntitySchema } from '@mikro-orm/mongodb';
import { user_schema } from './user';

export const permission_record_schema = new EntitySchema<PermissionRecord & { user: User; }>({
  collection: 'permissions',
  name: 'PermissionRecord',
  properties: {
    user: { kind: '1:1', entity: () => user_schema, owner: true, fieldName: '_id', primary: true },
    permissions: { type: 'array' },
    roles: { type: 'array' },
  }
});