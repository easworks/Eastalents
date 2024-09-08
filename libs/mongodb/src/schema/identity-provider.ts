import { IdpCredential } from '@easworks/models/identity-provider';
import { EntitySchema } from '@mikro-orm/mongodb';
import { user_schema } from './user';
import { id_prop } from '../utils';

export const user_credential_provider_schema = new EntitySchema<IdpCredential['provider']>({
  name: 'IdpCredential.provider',
  embeddable: true,
  properties: {
    email: { type: 'string' },
    id: { type: 'string' },
    type: { type: 'string' }
  }
});

export const user_credential_schema = new EntitySchema<IdpCredential>({
  collection: 'user-credentials',
  name: 'IdpCredential',
  properties: {
    _id: id_prop(),
    user: { kind: 'm:1', entity: () => user_schema },
    provider: { kind: 'embedded', entity: () => user_credential_provider_schema, object: true },
    credential: { type: 'string' },
  }
});