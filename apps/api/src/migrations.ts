import { user_credential_schema } from '@easworks/mongodb/schema/identity-provider';
import { oauth_client_application_schema } from '@easworks/mongodb/schema/oauth';
import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { user_schema } from '@easworks/mongodb/schema/user';
import { IdpCredential } from 'models/identity-provider';
import { OAuthClientApplication } from 'models/oauth';
import { PermissionRecord } from 'models/permission-record';
import { User } from 'models/user';
import { authRules } from 'server-side/auth/rules';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { Readable } from 'stream';
import { authHook } from './auth/hooks';

export const migrationHandlers: FastifyZodPluginAsync = async server => {
  server.post('/import',
    {
      onRequest: authHook(authRules.hasPermission('migration.import'))
    },
    async (req) => {
      const input = req.body as DataFile;

      await req.ctx.em.insertMany(user_schema, input.users, { upsert: true });
      await req.ctx.em.insertMany(permission_record_schema, input.permissions, { upsert: true });
      await req.ctx.em.insertMany(user_credential_schema, input.userCredentials, { upsert: true });

      await req.ctx.em.insertMany(oauth_client_application_schema, input.oauthApps, { upsert: true });
    }
  );

  server.post('/export',
    {
      onRequest: authHook(authRules.hasPermission('migration.export'))
    },
    async (req, rep) => {
      const users = await req.ctx.em.findAll(user_schema);
      const userCredentials = await req.ctx.em.findAll(user_credential_schema);
      const permissions = await req.ctx.em.findAll(permission_record_schema);
      const oauthApps = await req.ctx.em.findAll(oauth_client_application_schema);

      const data: DataFile = {
        users,
        userCredentials,
        permissions,

        oauthApps,
      };

      const buf = Buffer.from(JSON.stringify(data, null, 2));
      const readable = new Readable({
        read: () => void 0,
      });
      readable.push(buf);
      readable.push(null);


      return rep
        .header('content-disposition', `attachment; filename=eas-data.json`)
        .type('application/json')
        .send(readable);
    }
  );
};

interface DataFile {
  users: User[];
  userCredentials: IdpCredential[];
  permissions: PermissionRecord[];

  oauthApps: OAuthClientApplication[];
}

// included for posterity
// function getUpsertOps<T extends Entity>(documents: T[]) {
//   return documents.map(doc => ({
//     replaceOne: {
//       filter: { _id: doc._id } as Filter<T>,
//       replacement: doc,
//       upsert: true
//     }
//   } satisfies AnyBulkWriteOperation<T>));
// }

// function upsertDocuments<T extends Entity>(documents: T[], collection: Collection<T>) {
//   return collection.bulkWrite(getUpsertOps(documents));
// }