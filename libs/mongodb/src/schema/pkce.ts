import { OAuthCode } from '@easworks/models/oauth';
import { EntitySchema } from '@mikro-orm/mongodb';

export const pkce_challenge_schema = new EntitySchema<OAuthCode['challenge'] & {}>({
  name: 'PkceChallenge',
  embeddable: true,
  properties: {
    code: { type: 'string' },
    method: { type: 'string' }
  }
});
