import { OAuthClientApplication, OAuthCode } from '@easworks/models/oauth';
import { EntitySchema } from '@mikro-orm/mongodb';
import { id_prop, LuxonType, StringObjectIdType } from '../utils';
import { pkce_challenge_schema } from './pkce';
import { user_schema } from './user';

export const oauth_client_application_schema = new EntitySchema<OAuthClientApplication>({
  collection: 'oauth-apps',
  name: 'OAuthClientApplication',
  properties: {
    _id: id_prop(),
    name: { type: 'string' },
    redirectUris: { type: 'array' },
    firstParty: { type: 'boolean' }
  }
});


export const oauth_code_schema = new EntitySchema<OAuthCode>({
  collection: 'oauth-codes',
  name: 'OAuthCode',
  properties: {
    _id: id_prop(),
    value: { type: 'string' },
    client: { kind: 'm:1', entity: () => oauth_client_application_schema },
    user: { kind: 'm:1', entity: () => user_schema },
    challenge: { kind: 'embedded', entity: () => pkce_challenge_schema, object: true },
    redirectUri: { type: 'string' },
    expiresAt: { type: LuxonType },
    grantedTokens: { type: 'array' }
  }
});