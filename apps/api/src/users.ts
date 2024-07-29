import { UserSelfOutput } from 'models/validators/users';
import { AuthenticatedCloudContext } from 'server-side/context';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { authHook } from './auth/hooks';
import { CLOUD_CONTEXT_KEY } from './context';
import { easMongo } from './mongodb';

export const userHandlers: FastifyZodPluginAsync = async server => {

  server.get('/self',
    { onRequest: authHook() },
    async (req) => {
      const ctx = req.requestContext.get(CLOUD_CONTEXT_KEY) as AuthenticatedCloudContext;

      const user = await easMongo.users.findOne({ _id: ctx.auth._id });
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