import { DomainDataDTO } from '@easworks/models/domain';
import { Migration } from '@mikro-orm/migrations-mongodb';
import { keyval_schema } from '../schema/keyval';
import { oauth_client_application_schema } from '../schema/oauth';
import { seedKeyValueDocument } from '../utils';

export class Migration20240908145408_1_5_add_oauth_data extends Migration {

  async up(): Promise<void> {
    const em = this.driver.createEntityManager();

    em.create(oauth_client_application_schema, {
      "_id": "66a98aad5c881fc8f3ca2a57",
      "name": "easworks-web-client-local",
      "redirectUris": [
        "http://localhost:4104/oauth/callback"
      ],
      firstPartyDomain: 'easworks'
    });

    em.create(oauth_client_application_schema, {
      "_id": "66b7895420c29768cd795c19",
      "name": "easworks-web-client-development",
      "redirectUris": [
        "https://development.branches.easworks.com/oauth/callback"
      ],
      firstPartyDomain: 'easworks'
    });

    em.create(oauth_client_application_schema, {
      "_id": "66b789d820c29768cd795c1a",
      "name": "easworks-web-client-production",
      "redirectUris": [
        "https://easworks.com/oauth/callback"
      ],
      firstPartyDomain: 'easworks'
    });

    em.create(oauth_client_application_schema, {
      "_id": "66b84b4eacd0805ec87197b2",
      "name": "easdevhub-production",
      "redirectUris": [
        "https://easdevhub.com/auth/oauth2_basic/callback"
      ],
      firstPartyDomain: 'easdevhub'
    });

    await seedKeyValueDocument<DomainDataDTO>(em, 'domain-data', {
      domains: [],
      softwareProducts: [],
      techGroups: [],
      techSkills: []
    });
    await seedKeyValueDocument(em, 'free-email-providers', []);

    await em.flush();
  }

  override async down(): Promise<void> {
    const em = this.driver.createEntityManager();

    em.remove(em.getReference(oauth_client_application_schema, '66a98aad5c881fc8f3ca2a57'));
    em.remove(em.getReference(oauth_client_application_schema, '66b7895420c29768cd795c19'));
    em.remove(em.getReference(oauth_client_application_schema, '66b789d820c29768cd795c1a'));
    em.remove(em.getReference(oauth_client_application_schema, '66b84b4eacd0805ec87197b2'));

    em.remove(em.getReference(keyval_schema, 'domain-data'));
    em.remove(em.getReference(keyval_schema, 'free-email-providers'));

    await em.flush();
  }

}
