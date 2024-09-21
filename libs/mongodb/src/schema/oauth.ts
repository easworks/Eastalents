import { OAuthClientApplication, OAuthCode } from '@easworks/models/oauth';
import { EntitySchema } from '@mikro-orm/mongodb';
import { LuxonType } from '../custom-types';
import { id_prop } from '../utils';
import { user_schema } from './user';

export const oauth_client_application_schema = new EntitySchema<OAuthClientApplication>({
  collection: 'oauth-apps',
  name: 'OAuthClientApplication',
  properties: {
    _id: id_prop(),
    name: { type: 'string' },
    redirectUris: { type: 'string', array: true },
    firstPartyDomain: { type: 'string', nullable: true }
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
    challenge: { type: 'json', object: true },
    redirectUri: { type: 'string' },
    expiresAt: { type: LuxonType },
    grantedTokens: { type: 'string', array: true }
  }
});