import { isDevMode } from '@angular/core';
import { fastifyCors } from '@fastify/cors';
import { fastify, FastifyInstance } from 'fastify';
import * as path from 'path';
import { serveAngularSSR } from 'server-side/utils/angular-ssr';
import { useProblemDetailsGlobally } from 'server-side/utils/fastify-problem-details';
import { getLoggerOptions } from 'server-side/utils/logging';
import { printRoutes } from 'server-side/utils/print-routes.plugin';
import { fileURLToPath } from 'url';
import bootstrap from './main.server';

const development = isDevMode();

async function initServer() {
  // const options = development ? {} : { http2: true };
  const options = {};

  const server = fastify({
    ...options,
    logger: getLoggerOptions(development)
  });

  return server;
}

async function configureServer(server: FastifyInstance) {

  server.register(useProblemDetailsGlobally);
  server.register(printRoutes);

  server.register(serveAngularSSR, {
    bootstrap,
    directory: path.resolve(fileURLToPath(import.meta.url), '../..')
  });

  await server.register(fastifyCors, {
    origin: true
  });
}

export async function startServer() {
  const host = '0.0.0.0';
  const port = (() => {
    const p = process.env['PORT'];
    if (!p)
      throw new Error(`'PORT' not specified`);
    return Number.parseInt(p);
  })();

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
