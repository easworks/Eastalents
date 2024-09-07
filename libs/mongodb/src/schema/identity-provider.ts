import { IdpCredential } from '@easworks/models/identity-provider';
import { EntitySchema } from '@mikro-orm/core';
import { user_schema } from './user';

export const user_credentials_provider_schema = new EntitySchema<IdpCredential['provider']>({
  name: 'IdpCredential.provider',
  embeddable: true,
  properties: {
    email: { type: 'string' },
    id: { type: 'string' },
    type: { type: 'string' }
  }
});

export const user_credentials_schema = new EntitySchema<IdpCredential>({
  collection: 'user-credentials',
  name: 'IdpCredential',
  properties: {
    _id: { type: 'string', primary: true, serializedName: '_id' },
    user: { kind: '1:1', entity: () => user_schema, owner: true },
    provider: { kind: 'embedded', entity: () => user_credentials_provider_schema, object: true },
    credential: { type: 'string', nullable: true },
  }
});