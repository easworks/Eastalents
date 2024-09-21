import { token_ref_schema } from '@easworks/mongodb/schema/auth';
import { client_profile_schema } from '@easworks/mongodb/schema/client-profile';
import { user_credential_schema } from '@easworks/mongodb/schema/identity-provider';
import { oauth_code_schema } from '@easworks/mongodb/schema/oauth';
import { permission_record_schema } from '@easworks/mongodb/schema/permission-record';
import { talent_profile_schema } from '@easworks/mongodb/schema/talent-profile';
import { user_schema } from '@easworks/mongodb/schema/user';
import { EAS_EntityManager } from '@easworks/mongodb/types';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { authHook } from './auth/hooks';
import { environment } from './environment';

export const developmentHandlers: FastifyZodPluginAsync = async server => {

  if (environment.id === 'production')
    return;

  server.post('/delete-account',
    { 'onRequest': authHook() },
    async (req) => {
      const id = req.ctx.auth!._id;
      if (!id) throw new Error();

      return deleteUser(req.ctx.em, id);
    });
};

export async function deleteUser(em: EAS_EntityManager, _id: string) {
  const user = await em.findOneOrFail(user_schema, _id);

  await Promise.all([
    em.nativeDelete(token_ref_schema, { user }),
    em.nativeDelete(oauth_code_schema, { user }),
    em.nativeDelete(user_credential_schema, { user }),
    em.nativeDelete(permission_record_schema, { user }),
    em.nativeDelete(talent_profile_schema, { user }),
    em.nativeDelete(client_profile_schema, { user }),
    em.nativeDelete(user_schema, user)
  ]);
}