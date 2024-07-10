import { isDevMode } from '@angular/core';
import { fastifyCors } from '@fastify/cors';
import { fastify, FastifyInstance } from 'fastify';
import { useProblemDetailsGlobally } from 'server-side/utils/fastify-problem-details';
import { printRoutes } from 'server-side/utils/print-routes.plugin';

const development = isDevMode();

async function initServer() {
  const options = development ? {} : { http2: true };

  const server = fastify({
    ...options,
    logger: undefined
  });

  return server;
}

async function configureServer(server: FastifyInstance) {

  useProblemDetailsGlobally(server);

  server.register(printRoutes);

  await server.register(fastifyCors, {
    origin: true
  });
}

export async function startServer() {
  const host = '0.0.0.0';
  const port = 4200;

  const server = await initServer();

  try {
    await configureServer(server);
    server.listen({ host, port });
  }
  catch (e) {
    server.log.fatal(e);
  }
};

startServer();
