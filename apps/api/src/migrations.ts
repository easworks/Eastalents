import { Entity } from 'models/entity';
import { IdpCredential } from 'models/identity-provider';
import { OAuthClientApplication } from 'models/oauth';
import { PermissionRecord } from 'models/permission-record';
import { User } from 'models/user';
import { AnyBulkWriteOperation, Collection, Filter } from 'mongodb';
import { authRules } from 'server-side/auth/rules';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { Readable } from 'stream';
import { authHook } from './auth/hooks';
import { easMongo } from './mongodb';

export const migrationHandlers: FastifyZodPluginAsync = async server => {
  server.post('/import',
    {
      onRequest: authHook(authRules.hasPermission('migration.import'))
    },
    async (req) => {
      const input = req.body as DataFile;


      await upsertDocuments(input.users, easMongo.users);
      await upsertDocuments(input.permissions, easMongo.permissions);
      await upsertDocuments(input.userCredentials, easMongo.userCredentials);

      await upsertDocuments(input.oauthApps, easMongo.oauthApps);

    }
  );

  server.post('/export',
    {
      onRequest: authHook(authRules.hasPermission('migration.export'))
    },
    async (req, rep) => {
      const users = await easMongo.users.find().toArray();
      const userCredentials = await easMongo.userCredentials.find().toArray();
      const permissions = await easMongo.permissions.find().toArray();
      const oauthApps = await easMongo.oauthApps.find().toArray();

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

function getUpsertOps<T extends Entity>(documents: T[]) {
  return documents.map(doc => ({
    replaceOne: {
      filter: { _id: doc._id } as Filter<T>,
      replacement: doc,
      upsert: true
    }
  } satisfies AnyBulkWriteOperation<T>));
}

function upsertDocuments<T extends Entity>(documents: T[], collection: Collection<T>) {
  return collection.bulkWrite(getUpsertOps(documents));
}