import { Plugin } from 'esbuild';

export default async function ngSSRPackage() {
  const pluginName = 'ng-ssr-package';

  const plugin: Plugin = {
    name: pluginName,
    setup: build => {
      const options = build.initialOptions;
      if (options.platform !== 'node')
        return;

      options.packages = 'external';
    }
  };

  return plugin;
}