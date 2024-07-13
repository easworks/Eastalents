import { ApplicationRef } from '@angular/core';
import { CommonEngine } from '@angular/ssr';
import { FastifyPluginAsync } from 'fastify';

interface ServeAngularSSROptions {
  bootstrap: () => Promise<ApplicationRef>;
  directory: string;
}

export const serveAngularSSR: FastifyPluginAsync<ServeAngularSSROptions> = async (server, options) => {
  const engine = new CommonEngine();
  const serverDirectory = `${options.directory}/server`;
  const browserDirectory = `${options.directory}/browser`;
  const indexHtml = `${serverDirectory}/index.server.html`;

  server.get('**/*', async (req) => {

    console.debug([
      req.url,
      req.originalUrl,
      req.raw.url
    ].join('\n'));

    // engine.render({
    //   bootstrap: options.bootstrap,
    //   documentFilePath: indexHtml,
    //   url: `${protocol}://${headers.host}${originalUrl}`,
    //   publicPath: browserDirectory,
    //   providers: [{ provide: APP_BASE_HREF, useValue: req.raw.url }],
    // });
  });
};