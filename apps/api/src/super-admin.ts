import { objectId } from 'models/validators/common';
import { authRules } from 'server-side/auth/rules';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { z } from 'zod';
import { authHook } from './auth/hooks';
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
    async (req) => {
      const input = req.body;

      const user = await easMongo.users.findOne({ _id: input._id });
      if (!user)
        throw new Error('user not found');

      await Promise.all([
        easMongo.tokens.deleteMany({ userId: user._id }),
        easMongo.oauthCodes.deleteMany({ userId: user._id }),
        easMongo.userCredentials.deleteMany({ userId: user._id }),
        easMongo.permissions.deleteOne({ _id: user._id }),
        easMongo.users.deleteOne({ _id: user._id })
      ]);
    });

};