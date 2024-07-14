import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef } from '@angular/core';
import { CommonEngine } from '@angular/ssr';
import { fastifyStatic } from '@fastify/static';
import { FastifyPluginAsync } from 'fastify';
import mime from 'mime';
import * as path from 'path';

interface ServeAngularSSROptions {
  bootstrap: () => Promise<ApplicationRef>;
  directory: string;
}

export const serveAngularSSR: FastifyPluginAsync<ServeAngularSSROptions> = async (server, options) => {
  const engine = new CommonEngine();
  const serverDirectory = path.resolve(options.directory, 'server');
  const browserDirectory = path.resolve(options.directory, 'browser');
  const indexHtml = path.resolve(serverDirectory, 'index.server.html');


  const htmlMime = mime.getType('html');
  if (!htmlMime)
    throw new Error('invalid operation');

  server.register(fastifyStatic, {
    root: browserDirectory,
    serve: false
  });

  server.get('*', async (req, rep) => {
    const extension = mime.getType(req.url);

    if (extension) {
      return rep.sendFile(req.url);
    }
    else {
      rep.type(htmlMime);

      return engine.render({
        bootstrap: options.bootstrap,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
        publicPath: browserDirectory,
        providers: [{ provide: APP_BASE_HREF, useValue: req.raw.url }],
      });
    }
  });
};