import { Plugin } from 'esbuild';
import * as path from 'node:path';

export const extensionlessImportsPlugin: Plugin = {
  name: 'extensionlessImports',
  setup: build => {
    build.onResolve(
      { filter: /.*/, namespace: 'file' },
      async ({ path: file, ...options }) => {

        const ext = path.extname(file);
        if (ext)
          return build.resolve(file, { ...options, namespace: extensionlessImportsPlugin.name });
        else {
          let result = await build.resolve(file, { ...options, namespace: extensionlessImportsPlugin.name });
          if (result.errors.length !== 0) {
            const ext = path.extname(options.importer);
            const tryWithExtension = await build.resolve(file + ext, { ...options, namespace: extensionlessImportsPlugin.name });
            if (tryWithExtension.errors.length === 0)
              return tryWithExtension;
          }
          return result;
        }
      }
    );
  }
};