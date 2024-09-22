import { ClientProfile } from '@easworks/models/client-profile';
import { client_profile_schema } from '@easworks/mongodb/schema/client-profile';
import { FilterQuery } from '@mikro-orm/core';
import { authRules } from 'server-side/auth/rules';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { authHook } from './auth/hooks';

export const clientHandlers: FastifyZodPluginAsync = async server => {
  server.get('/profile',
    {
      onRequest: authHook(authRules.hasRole('client'))
    },
    async req => {
      const auth = req.ctx.auth!;

      const query: FilterQuery<ClientProfile> = { user: auth._id };

      return await req.ctx.em.findOneOrFail(client_profile_schema, query);
    }
  );
};