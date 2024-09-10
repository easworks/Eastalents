import { keyval_schema } from './schema/keyval';
import { EAS_EntityManager } from './types';

export function id_prop() {
  return { type: 'string', primary: true, serializedName: '_id' } as const;
}

export async function seedKeyValueDocument<T = unknown>(em: EAS_EntityManager, key: string, value: T, overwrite?: boolean) {
  let doc = await em.findOne(keyval_schema, key);
  if (doc) {
    if (overwrite)
      doc.value = value;
  }
  else {
    doc = em.create(keyval_schema, { _id: key, value });
  }
}