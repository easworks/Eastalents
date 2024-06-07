import { BuildResult, Metafile, Plugin } from 'esbuild';
import { DateTime } from 'luxon';
import * as path from 'path';
import { shimPlugin } from './shim.plugin';

export function swPlugin(config: {
  src: string,
  destination: string,
  tsconfig: string;
}) {
  const plugin: Plugin = {
    name: 'swPlugin',
    setup: (build) => {
      const options = build.initialOptions;
      options.metafile = true;

      let swBuild: BuildResult;

      build.onStart(async () => {
        const result = await build.esbuild.build({
          entryPoints: [
            { out: config.destination, in: config.src }
          ],
          entryNames: '[name]',
          plugins: [
            shimPlugin({ replace: '@angular/core', with: 'angular-sw' }),
          ],
          bundle: true,
          write: false,
          sourcemap: false,
          platform: 'browser',
          metafile: true,

          absWorkingDir: options.absWorkingDir,
          outdir: options.outdir,
          format: options.format,
          tsconfig: config.tsconfig
        });
        swBuild = result;
        return {
          errors: result.errors,
          warnings: result.warnings,
        };
      });

      build.onEnd(async (result) => {
        if (result.errors.length) return;

        if (!result.metafile || !result.outputFiles) return;
        if (!swBuild.metafile || !swBuild.outputFiles) return;

        {
          const metafile = result.metafile;
          const entryPoint = path.relative(options.absWorkingDir!, options.entryPoints!['main'])
            .replace(/\\/g, '/');
          const main = Object.keys(metafile.outputs).find(key => metafile.outputs[key].entryPoint === entryPoint);
          if (!main) return;

          const manifest = extractManifest(main, result.metafile);
          const outFile = swBuild.outputFiles[0];
          let workerCode = outFile.text;
          workerCode = workerCode.replace('self.__WB_MANIFEST', JSON.stringify(manifest));
          outFile.hash = manifest[0].revision;
          outFile.contents = new TextEncoder().encode(workerCode);
        }

        result.metafile = mergeMetaFiles(swBuild.metafile, result.metafile);
        result.outputFiles.push(...swBuild.outputFiles);
      });
    }
  };

  return plugin;
}

/** **Important**: items from file b will overwrite those from file a if item keys match */
function mergeMetaFiles(a: Metafile, b: Metafile) {
  return {
    inputs: Object.assign(a.inputs, b.inputs),
    outputs: Object.assign(a.outputs, b.outputs)
  };
}

function extractManifest(main: string, metaFile: Metafile,) {

  const fileNames: string[] = [
    'index.html',
    'styles.css',
    main,
  ];

  const mainChunk = metaFile.outputs[main];

  for (const imp of mainChunk.imports) {
    if (!imp.external && imp.kind === 'import-statement') fileNames.push(imp.path);
  }

  const now = DateTime.now().toMillis().toString();
  const manifest = fileNames.map(name => ({ url: name, revision: now }));

  return manifest;
}
