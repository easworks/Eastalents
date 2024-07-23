import { FastifyPluginAsync } from 'fastify';

export const oauthHandlers: FastifyPluginAsync = async server => {

  server.get('/authorize', async () => {
    throw new Error('not implemented');
  });

  server.get('/token', async () => {
    throw new Error('not implemented');
  });

};