import { PermissionRecord } from '@easworks/models/permission-record';
import { EntitySchema } from '@mikro-orm/mongodb';
import { id_prop } from '../utils';

export const permission_record_schema = new EntitySchema<PermissionRecord>({
  collection: 'permissions',
  name: 'PermissionRecord',
  properties: {
    _id: id_prop(),
    permissions: { type: 'array' },
    roles: { type: 'array' }
  }
});