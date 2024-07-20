import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { printRoutes } from 'server-side/utils/print-routes.plugin';
import { oauthHandlers } from './auth/oauth';

const pluginImpl: FastifyPluginAsync = async server => {

  await server.register(printRoutes);

  await server.register(oauthHandlers, { prefix: 'oauth' });

};

export const handlers = fastifyPlugin(pluginImpl);