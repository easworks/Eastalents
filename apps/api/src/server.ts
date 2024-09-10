import { fastifyCors } from '@fastify/cors';
import { fastifyFormbody } from '@fastify/formbody';
import { fastify, FastifyInstance } from 'fastify';
import { useProblemDetailsGlobally } from 'server-side/utils/fastify-problem-details';
import { useZodValidation } from 'server-side/utils/fastify-zod';
import { getLoggerOptions } from 'server-side/utils/logging';
import { useCloudContext } from './context';
import { environment } from './environment';
import { handlers } from './handlers';

async function initServer() {
  const options = {};

  const server = fastify({
    ...options,
    logger: getLoggerOptions(environment.id)
  });

  return server;
}

async function configureServer(server: FastifyInstance) {

  await server.register(useProblemDetailsGlobally);
  await server.register(useZodValidation);

  await server.register(fastifyCors, {
    origin: true
  });
  await server.register(fastifyFormbody);
  await server.register(useCloudContext);

  await server.orm.connect();

  await server.register(handlers);
}

export async function startServer() {
  const host = '0.0.0.0';
  const port = environment.port;

  const server = await initServer();

  try {
    await configureServer(server);
    await server.listen({ host, port });
    process.on('SIGTERM', () => closeServer(server));
    process.on('SIGINT', () => closeServer(server));
  }
  catch (e) {
    server.log.fatal(e);
    if (environment.id === 'local')
      console.error(e);
    closeServer(server);
  }
};

async function closeServer(server: FastifyInstance) {
  await server.close();
  await server.orm.close();
  process.exit();
}

startServer();