import { Migration } from '@mikro-orm/migrations-mongodb';
import { email_verification_code_ref_schema, password_reset_code_ref_schema } from '../schema/auth';
import { user_credential_schema } from '../schema/identity-provider';

export class Migration20240908013836_1_3_add_indexes extends Migration {

  async up(): Promise<void> {
    const user_credentials_collection = this.getCollection(user_credential_schema);
    await user_credentials_collection.createIndex(
      { 'provider.email': 1 },
      { name: 'provider.email' }
    );
    await user_credentials_collection.createIndex(
      { 'provider.id': 1, 'provider.type': 1 },
      { name: 'unique_external_user', unique: true }
    );
    await user_credentials_collection.createIndex(
      { 'user': 1 },
      {
        name: 'unique_password_credential', unique: true,
        partialFilterExpression: { 'provider.type': 'email' }
      }
    );

    const email_verification_code_ref_collection = this.getCollection(email_verification_code_ref_schema);
    await email_verification_code_ref_collection.createIndex(
      { expiresAt: 1 },
      { name: 'ttl', expireAfterSeconds: 0 }
    );
    await email_verification_code_ref_collection.createIndex(
      { email: 1 },
      { name: 'email', unique: true }
    );

    const password_reset_code_ref_collection = this.getCollection(password_reset_code_ref_schema);
    await password_reset_code_ref_collection.createIndex(
      { expiresAt: 1 },
      { name: 'ttl', expireAfterSeconds: 0 }
    );
    await password_reset_code_ref_collection.createIndex(
      { email: 1 },
      { name: 'email', unique: true }
    );
  }

  override async down(): Promise<void> {
    const user_credentials_collection = this.getCollection(user_credential_schema);
    await user_credentials_collection.dropIndex('provider.email');
    await user_credentials_collection.dropIndex('unique_external_user');
    await user_credentials_collection.dropIndex('unique_password_credential');

    const email_verification_code_ref_collection = this.getCollection(email_verification_code_ref_schema);
    await email_verification_code_ref_collection.dropIndex('ttl');
    await email_verification_code_ref_collection.dropIndex('email');

    const password_reset_code_ref_collection = this.getCollection(password_reset_code_ref_schema);
    await password_reset_code_ref_collection.dropIndex('ttl');
    await password_reset_code_ref_collection.dropIndex('email');
  }

}
