import { BuildResult, Metafile, Plugin, build } from 'esbuild';
import * as path from 'path';
import { extractManifest } from './extract-manifest';

export interface ServiceWorkerPluginOptions {
  src: string,
  destination: string,
  tsconfig: string;
}

export default function serviceWorkerPlugin(config: ServiceWorkerPluginOptions) {
  const pluginName = 'service-worker-plugin';
  const plugin: Plugin = {
    name: pluginName,
    setup: (build) => {
      const options = build.initialOptions;
      if (options.platform !== 'browser')
        return;

      let swBuild: BuildResult;

      build.onStart(async () => {
        const result = await buildSw(build.esbuild.build, {
          src: config.src,
          destination: config.destination,
          outdir: options.outdir,
          absWorkingDir: options.absWorkingDir,
          tsconfig: options.tsconfig,
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

export function buildSw(
  buildFn: typeof build,
  options: {
    src: string;
    destination: string;
    tsconfig: string;
    absWorkingDir: string;
    outdir: string;
  }
) {
  return buildFn({
    entryPoints: [
      { out: options.destination, in: options.src }
    ],
    entryNames: '[name]',
    bundle: true,
    write: false,
    sourcemap: false,
    platform: 'browser',
    metafile: true,

    absWorkingDir: options.absWorkingDir,
    outdir: options.outdir,
    format: 'esm',
    tsconfig: options.tsconfig
  });
}
