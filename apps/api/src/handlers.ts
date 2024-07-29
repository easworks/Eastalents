import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { printRoutes } from 'server-side/utils/print-routes.plugin';
import { authHandlers } from './auth/auth';
import { oauthHandlers } from './auth/oauth';
import { migrationHandlers } from './migrations';
import { userHandlers } from './users';

const pluginImpl: FastifyPluginAsync = async server => {

  await server.register(printRoutes);

  await server.register(oauthHandlers, { prefix: 'oauth' });
  await server.register(authHandlers, { prefix: 'auth' });
  await server.register(userHandlers, { prefix: 'users' });

  await server.register(migrationHandlers, { prefix: 'migration' });
};

export const handlers = fastifyPlugin(pluginImpl);