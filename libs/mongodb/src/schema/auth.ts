import { TokenRef } from '@easworks/models/auth';
import { EntitySchema } from '@mikro-orm/mongodb';
import { id_prop, LuxonType } from '../utils';
import { user_schema } from './user';

export const token_ref_schema = new EntitySchema<TokenRef>({
  collection: 'tokens',
  name: 'TokenRef',
  properties: {
    _id: id_prop(),
    expiresIn: { type: LuxonType },
    user: { kind: 'm:1', entity: () => user_schema }
  }
});