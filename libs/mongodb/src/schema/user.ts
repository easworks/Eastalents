import { User } from '@easworks/models/user';
import { EntityMetadata, EntitySchema } from '@mikro-orm/mongodb';

export const user_schema = new EntitySchema<User>({
  collection: 'users',
  name: 'User',
  properties: {
    _id: { type: 'string', primary: true, serializedName: '_id' },
    email: { type: 'string' },
    enabled: { type: 'boolean' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    imageUrl: { type: 'string', nullable: true },
    username: { type: 'string' },
  } as EntityMetadata<User>['properties']
});
