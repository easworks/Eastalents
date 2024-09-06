import { UserSelfOutput } from 'models/validators/users';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { authHook } from './auth/hooks';
import { easMongo } from './mongodb';

export const userHandlers: FastifyZodPluginAsync = async server => {

  server.get('/self',
    { onRequest: authHook() },
    async (req) => {
      const auth = req.ctx.auth!;

      const user = await easMongo.users.findOne({ _id: auth._id });
      if (!user)
        throw new Error('user should not be null');
      const permissionRecord = await easMongo.permissions.findOne({ _id: user._id });
      if (!permissionRecord)
        throw new Error('permissions should not be null');

      const result: UserSelfOutput = {
        user,
        permissionRecord
      };

      return result;
    }
  );

};