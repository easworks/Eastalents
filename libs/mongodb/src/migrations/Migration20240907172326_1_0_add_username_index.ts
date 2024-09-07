import { Migration } from '@mikro-orm/migrations-mongodb';
import { user_schema } from '../schema/user';
import { indexNameForCollection } from '../utils';

export class Migration20240907172326_1_0_add_username_index extends Migration {

  async up(): Promise<void> {
    const user_collection = this.getCollection(user_schema);
    user_collection.createIndex(
      {
        'username': 1
      },
      {
        name: indexNameForCollection('username', user_collection),
        unique: true
      }
    );
  }

  override async down(): Promise<void> {
    const user_collection = this.getCollection(user_schema);
    user_collection.dropIndex(indexNameForCollection('username', user_collection));
  }

}
