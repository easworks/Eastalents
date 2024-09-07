import { defineConfig } from '@mikro-orm/mongodb';
import { entities } from './schema';

export function buildConfig(connectionString: string) {

  return defineConfig({
    clientUrl: connectionString,
    dbName: 'easworks',
    validateRequired: false,
    strict: false,
    validate: false,
    implicitTransactions: false,

    serialization: {
      forceObject: true,
      includePrimaryKeys: true
    },

    entities
  });
}