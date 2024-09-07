import type { Collection } from 'mongodb';

export function indexNameForCollection(name: string, collection: Collection) {
  return `${collection.collectionName}_${name}`;
}