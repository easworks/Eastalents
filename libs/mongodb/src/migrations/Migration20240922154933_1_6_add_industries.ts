import { Migration } from '@mikro-orm/migrations-mongodb';
import { seedKeyValueDocument } from '../utils';
import { keyval_schema } from '../schema/keyval';

export class Migration20240922154933_1_6_add_industries extends Migration {

  async up(): Promise<void> {
    const em = this.driver.createEntityManager();

    await seedKeyValueDocument(em, 'industries', {});

    await em.flush();
  }

  override async down(): Promise<void> {
    const em = this.driver.createEntityManager();

    em.remove(em.getReference(keyval_schema, 'industries'));

    await em.flush();
  }

}
