import { Migrator } from '@mikro-orm/migrations-mongodb';
import { buildConfig } from './mikro-orm.config';
import { SeedManager } from '@mikro-orm/seeder';

const connectionString = process.env['MONGODB'];
if (!connectionString)
  throw new Error('connection string not provided');

const options = buildConfig(connectionString);

options.extensions ||= [];

options.extensions.push(Migrator);
options.extensions.push(SeedManager);

export default options;