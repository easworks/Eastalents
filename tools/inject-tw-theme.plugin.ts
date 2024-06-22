import { Plugin } from 'esbuild';
import * as path from 'path';
import resolveConfig from 'tailwindcss/resolveConfig';

interface Options {
  configPath: string;
}

export default function injectTwThemePlugin({ configPath }: Options) {
  return {
    name: 'inject-tw-theme-plugin',
    setup: async (build) => {
      const filePath = path.resolve(build.initialOptions.absWorkingDir, configPath);
      const config = await import(filePath);
      const fullConfig = resolveConfig(config);

      build.initialOptions.define ||= {};
      build.initialOptions.define['__TW_THEME'] = JSON.stringify(fullConfig.theme);
    }
  } satisfies Plugin;
}