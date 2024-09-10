import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { user_schema } from '@easworks/mongodb/schema/user';
import { UserSelfOutput } from 'models/validators/users';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { authHook } from './auth/hooks';

export const userHandlers: FastifyZodPluginAsync = async server => {

  server.get('/self',
    { onRequest: authHook() },
    async (req) => {
      const auth = req.ctx.auth!;

      const user = await req.ctx.em.findOneOrFail(user_schema, auth._id);
      const permissionRecord = await req.ctx.em.findOneOrFail(permission_record_schema, { user });

      const result: UserSelfOutput = {
        user,
        permissionRecord
      };

      return result;
    }
  );

};