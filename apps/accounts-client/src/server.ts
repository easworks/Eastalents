import { fastifyCors } from '@fastify/cors';
import { fastify, FastifyInstance } from 'fastify';
import * as path from 'path';
import { parseEnv } from 'server-side/environment';
import { serveAngularSSR } from 'server-side/utils/angular-ssr';
import { useProblemDetailsGlobally } from 'server-side/utils/fastify-problem-details';
import { getLoggerOptions } from 'server-side/utils/logging';
import { printRoutes } from 'server-side/utils/print-routes.plugin';
import { fileURLToPath } from 'url';
import bootstrap from './main.server';

const envId = parseEnv.nodeEnv();

async function initServer() {
  // const options = development ? {} : { http2: true };
  const options = {};

  const server = fastify({
    ...options,
    logger: getLoggerOptions(envId)
  });

  return server;
}

async function configureServer(server: FastifyInstance) {

  server.register(useProblemDetailsGlobally);
  server.register(printRoutes);

  server.register(serveAngularSSR, {
    bootstrap,
    directory: path.resolve(fileURLToPath(import.meta.url), '../..'),
    environmentId: envId
  });

  await server.register(fastifyCors, {
    origin: true
  });
}

export async function startServer() {
  const host = '0.0.0.0';
  const port = Number.parseInt(process.env['PORT'] as string);

  const server = await initServer();

  try {
    await configureServer(server);
    await server.listen({ host, port });
    process.on('SIGTERM', () => closeServer(server));
    process.on('SIGINT', () => closeServer(server));
  }
  catch (e) {
    server.log.fatal(e);
    closeServer(server);
  }
};

async function closeServer(server: FastifyInstance) {
  await server.close();
  process.exit();
}

startServer();
