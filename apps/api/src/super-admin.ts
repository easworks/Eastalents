import { FastifyPluginAsync } from 'fastify';
import { authRules } from 'server-side/auth/rules';
import { authHook } from './auth/hooks';
import { easMongo } from './mongodb';

export const superAdminHandlers: FastifyPluginAsync = async server => {

  const isSuperAdmin = authRules.hasRole('super-admin');

  server.addHook('onRequest', authHook(isSuperAdmin));


  server.get('/reset-auth', async () => {
    await easMongo.oauthCodes.deleteMany();
    await easMongo.tokens.deleteMany();
  });

};