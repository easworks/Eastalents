import { objectId } from 'models/validators/common';
import { authRules } from 'server-side/auth/rules';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { z } from 'zod';
import { authHook } from './auth/hooks';
import { deleteUser } from './development';
import { easMongo } from './mongodb';

export const superAdminHandlers: FastifyZodPluginAsync = async server => {

  const isSuperAdmin = authRules.hasRole('super-admin');

  server.addHook('onRequest', authHook(isSuperAdmin));


  server.get('/reset-auth', async () => {
    await easMongo.oauthCodes.deleteMany();
    await easMongo.tokens.deleteMany();
  });

  server.post('/delete-user',
    {
      schema: {
        body: z.strictObject({
          _id: objectId
        })
      }
    },
    async (req) => deleteUser(req.body._id)
  );
};