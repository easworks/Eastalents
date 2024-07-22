import { IdpCredential } from 'models/identity-provider';
import { User } from 'models/user';
import { Collection, MongoClient } from 'mongodb';

const collections = [
  'users'
] as const;
type collection = typeof collections[number];

const collectionMeta = {
  'users': '1.0.0'
} as const satisfies Record<collection, string>;

export type TypeVersioned<T, V extends string> = T & { _typeVersion: V; };

export function setTypeVersion<T extends object>(object: T, collection: collection):
  TypeVersioned<T, typeof collectionMeta[typeof collection]> {
  return Object.assign(object, { _typeVersion: collectionMeta[collection] });
}

export function initialiseMongo(client: MongoClient) {

  const db = client.db('easworks', { ignoreUndefined: true });

  return {
    client,
    db,

    users: db.collection('users') as Collection<User>,
    userCredentials: db.collection('user-credentials') as Collection<IdpCredential>,
  };
}