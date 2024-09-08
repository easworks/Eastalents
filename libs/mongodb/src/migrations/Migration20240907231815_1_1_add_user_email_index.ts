import { Migration } from '@mikro-orm/migrations-mongodb';
import { user_schema } from '../schema/user';

export class Migration20240907231815_1_1_add_user_email_index extends Migration {

  async up(): Promise<void> {
    const user_collection = this.getCollection(user_schema);
    await user_collection.createIndex(
      {
        'email': 1
      },
      {
        name: 'email',
        unique: true
      }
    );
  }

  override async down(): Promise<void> {
    const user_collection = this.getCollection(user_schema);
    await user_collection.dropIndex('email');
  }

}
