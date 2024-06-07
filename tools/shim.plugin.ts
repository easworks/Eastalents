import { BuildResult, Plugin } from 'esbuild';
import * as path from 'path';
import { extensionlessImportsPlugin } from './extensionless-imports.plugin';

export interface ShimOptions {
  replace: string;
  with: string;
}

export function shimPlugin(options: ShimOptions) {
  const pluginName = 'shimPlugin';
  const plugin: Plugin = {
    name: pluginName,
    setup: build => {

      let buildResult: BuildResult;

      build.onStart(async () => {
        buildResult = await build.esbuild.build({
          ...build.initialOptions,
          entryPoints: [
            path.resolve(__dirname, 'shims', options.with + '.js')
          ],
          bundle: true,
          write: false,
          plugins: [extensionlessImportsPlugin],
        });
      });

      build.onResolve(
        { filter: new RegExp(`^${options.replace}$`) },
        () => ({ path: options.with + '.js', namespace: pluginName })
      );

      build.onLoad(
        { filter: new RegExp(`^${options.with}\\.js$`), namespace: pluginName },
        (args) => {
          const file = buildResult.outputFiles[0];
          return { contents: file.text, loader: 'js' };
        }
      );
    }
  };

  return plugin;
}

