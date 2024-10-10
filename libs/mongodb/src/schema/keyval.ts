import { KeyValDocument as KvEntity } from '@easworks/models/keyval';
import { EntitySchema } from '@mikro-orm/mongodb';
import { LuxonType } from '../custom-types';
import { EAS_EntityManager } from '../types';
import { id_prop } from '../utils';

export interface KeyValDocument extends KvEntity { };

export class KeyValDocument {
  public static async get<T>(em: EAS_EntityManager, key: string) {
    const doc = await em.findOne(keyval_schema, key);
    return doc ? doc.value as T : null;
  }

  public static async exists(em: EAS_EntityManager, key: string) {
    const count = await em.count(keyval_schema, key);
    return count > 0;
  }
}

export const keyval_schema = new EntitySchema<KeyValDocument>({
  collection: 'keyval',
  name: 'KeyValDocument',
  properties: {
    _id: { ...id_prop(), type: 'string' },
    value: { type: 'jsonb' },
    updatedOn: { type: LuxonType, nullable: true }
  }
});