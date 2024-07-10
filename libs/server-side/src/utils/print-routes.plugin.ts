import { FastifyPluginAsync } from 'fastify/types/plugin';

export const printRoutes: FastifyPluginAsync = async server => {
  server.get('/list-all-routes', async () => {
    return server.printRoutes({ commonPrefix: false });
  });
};