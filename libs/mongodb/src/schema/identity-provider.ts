import { IdpCredential } from '@easworks/models/identity-provider';
import { EntitySchema } from '@mikro-orm/mongodb';
import { id_prop } from '../utils';
import { user_schema } from './user';

export const user_credential_schema = new EntitySchema<IdpCredential>({
  collection: 'user-credentials',
  name: 'IdpCredential',
  properties: {
    _id: id_prop(),
    user: { kind: 'm:1', entity: () => user_schema },
    provider: { type: 'json', object: true },
    credential: { type: 'string' },
  }
});