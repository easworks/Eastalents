import { Plugin } from 'esbuild';
import * as path from 'path';
import { getSwBuildConfig } from './build';
import { extractManifest, mergeMetaFiles } from './process-meta-files';

export interface ServiceWorkerPluginOptions {
  src: string,
  destination: string,
  tsconfig: string;
}

export default async function serviceWorkerPlugin(config: ServiceWorkerPluginOptions) {
  const pluginName = 'service-worker-plugin';
  const plugin: Plugin = {
    name: pluginName,
    setup: (build) => {
      const options = build.initialOptions;

      const isDevServer = !(options.entryPoints && ('server' in options.entryPoints));
      const index = isDevServer ? '/' : '/index.csr.html';

      if (options.platform !== 'browser')
        return;

      options.define!['__SW_URL'] = `'/${config.destination}.js'`;

      build.onEnd(async (result) => {
        if (result.errors.length) return;

        if (!result.metafile || !result.outputFiles) return;

        const metafile = result.metafile;
        const main = path.relative(options.absWorkingDir!, (options.entryPoints as Record<string, string>)['main'])
          .replace(/\\/g, '/');

        const manifest = extractManifest(main, metafile, index);

        const swBuild = await build.esbuild.build({
          ...getSwBuildConfig(
            config,
            index,
            manifest,
            options.define!['ngDevMode']
          ),
          absWorkingDir: options.absWorkingDir,
          outdir: options.outdir,
          sourcemap: options.sourcemap
        });

        result.metafile = mergeMetaFiles(swBuild.metafile!, result.metafile);

        result.outputFiles.push(...swBuild.outputFiles!);
      });
    }
  };

  return plugin;
}
