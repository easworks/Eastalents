import { BuildResult, Metafile, Plugin } from 'esbuild';
import { DateTime } from 'luxon';

const swPlugin: Plugin = {
  name: 'swPlugin',
  setup: (build) => {
    const projectRoot = 'apps/web-client';
    const config = {
      src: `${projectRoot}/src/service-worker/sw.worker.ts`,
      destination: 'eastalents-web-client-sw',
      tsconfig: `${projectRoot}/tsconfig.worker.json`
    };

    const options = build.initialOptions;
    options.metafile = true;

    let swBuild: BuildResult;

    build.onStart(async () => {
      const result = await build.esbuild.build({
        entryPoints: [
          { out: config.destination, in: config.src }
        ],
        entryNames: '[name]',
        plugins: [],
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
        const manifest = extractManifest(result.metafile);
        const outFile = swBuild.outputFiles[0];
        let workerCode = outFile.text;
        workerCode = workerCode.replace('self.__WB_MANIFEST', JSON.stringify(manifest));
        outFile.contents = new TextEncoder().encode(workerCode);
      }

      result.metafile = mergeMetaFiles(swBuild.metafile, result.metafile);
      result.outputFiles.push(...swBuild.outputFiles);
    });
  },
};

export default swPlugin;

/** **Important**: items from file b will overwrite those from file a if item keys match */
function mergeMetaFiles(a: Metafile, b: Metafile) {
  return {
    inputs: Object.assign(a.inputs, b.inputs),
    outputs: Object.assign(a.outputs, b.outputs)
  };
}

function extractManifest(metaFile: Metafile) {

  const fileNames: string[] = [
    'index.html',
    'main.js',
    'polyfills.js',
    'styles.css'
  ];

  const main = metaFile.outputs['main.js'];
  for (const imp of main.imports) {
    if (!imp.external && imp.kind === 'import-statement') fileNames.push(imp.path);
  }

  const now = DateTime.now().toMillis().toString();
  const manifest = fileNames.map(name => ({ url: name, revision: now }));

  return manifest;
}