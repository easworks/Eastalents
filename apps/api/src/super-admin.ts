import { token_ref_schema } from '@easworks/mongodb/schema/auth';
import { oauth_code_schema } from '@easworks/mongodb/schema/oauth';
import { objectId } from 'models/validators/common';
import { authRules } from 'server-side/auth/rules';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { z } from 'zod';
import { authHook } from './auth/hooks';
import { deleteUser } from './development';

export const superAdminHandlers: FastifyZodPluginAsync = async server => {

  const isSuperAdmin = authRules.hasRole('super-admin');

  server.addHook('onRequest', authHook(isSuperAdmin));


  server.get('/reset-auth', async (req) => {
    await req.ctx.em.nativeDelete(oauth_code_schema, {});
    await req.ctx.em.nativeDelete(token_ref_schema, {});
  });

  server.post('/delete-user',
    {
      schema: {
        body: z.strictObject({
          _id: objectId
        })
      }
    },
    async (req) => deleteUser(req.ctx.em, req.body._id)
  );
};