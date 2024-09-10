import { Migration } from '@mikro-orm/migrations-mongodb';
import { user_schema } from '../schema/user';

export class Migration20240907172326_1_0_add_username_index extends Migration {

  async up(): Promise<void> {
    const user_collection = this.getCollection(user_schema);
    await user_collection.createIndex(
      { 'username': 1 },
      { name: 'username', unique: true }
    );
  }

  override async down(): Promise<void> {
    const user_collection = this.getCollection(user_schema);
    await user_collection.dropIndex('username');
  }

}
