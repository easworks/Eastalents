import { Migration } from '@mikro-orm/migrations-mongodb';
import { token_ref_schema } from '../schema/auth';
import { oauth_code_schema } from '../schema/oauth';

export class Migration20240908005245_1_2_add_indexes extends Migration {

  async up(): Promise<void> {
    const oauth_code_collection = this.getCollection(oauth_code_schema);
    await oauth_code_collection.createIndex(
      { 'value': 1 },
      { name: 'value', unique: true }
    );
    await oauth_code_collection.createIndex(
      { 'expiresAt': 1 },
      { name: 'ttl', expireAfterSeconds: 0 }
    );

    const token_ref_collection = this.getCollection(token_ref_schema);
    await token_ref_collection.createIndex(
      { 'expiresAt': 1 },
      { name: 'ttl', expireAfterSeconds: 0 }
    );
  }

  override async down(): Promise<void> {
    const oauth_code_collection = this.getCollection(oauth_code_schema);
    await oauth_code_collection.dropIndex('value');
    await oauth_code_collection.dropIndex('ttl');

    const token_ref_collection = this.getCollection(token_ref_schema);
    await token_ref_collection.dropIndex('ttl');

  }

}
