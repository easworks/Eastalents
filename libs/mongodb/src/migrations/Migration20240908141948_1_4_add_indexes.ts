import { Migration } from '@mikro-orm/migrations-mongodb';
import { oauth_client_application_schema } from '../schema/oauth';

export class Migration20240908141948_1_4_add_indexes extends Migration {

  async up(): Promise<void> {
    const oauth_client_app_collection = this.getCollection(oauth_client_application_schema);
    await oauth_client_app_collection.createIndex(
      { name: 1 },
      { name: 'name', unique: true }
    );
    await oauth_client_app_collection.createIndex(
      { redirectUris: 1 },
      { name: 'redirectUris', unique: true }
    );
  }

  override async down(): Promise<void> {
    const oauth_client_app_collection = this.getCollection(oauth_client_application_schema);
    await oauth_client_app_collection.dropIndex('name');
    await oauth_client_app_collection.dropIndex('redirectUris');
  }
}
