import fastifyCors from '@fastify/cors';
import { fastify, FastifyInstance } from 'fastify';
import { useProblemDetailsGlobally } from 'server-side/utils/fastify-problem-details';
import { getLoggerOptions } from 'server-side/utils/logging';
import { environment } from './environment';
import { handlers } from './handlers';

async function initServer() {
  const options = {};

  const server = fastify({
    ...options,
    logger: getLoggerOptions(environment.development)
  });

  return server;
}

async function configureServer(server: FastifyInstance) {

  await server.register(useProblemDetailsGlobally);

  await server.register(fastifyCors, {
    origin: true
  });

  await server.register(handlers);
}

export async function startServer() {
  const host = '0.0.0.0';
  const port = environment.port;

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