import { User } from '@easworks/models/user';
import { EntitySchema } from '@mikro-orm/mongodb';
import { id_prop } from '../utils';

export const user_schema = new EntitySchema<User>({
  collection: 'users',
  name: 'User',
  properties: {
    _id: id_prop(),
    email: { type: 'string' },
    enabled: { type: 'boolean' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    imageUrl: { type: 'string' },
    username: { type: 'string' },
  }
});
