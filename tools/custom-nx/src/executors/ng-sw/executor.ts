import { ExecutorContext, parseTargetString, readTargetOptions } from '@nx/devkit';
import { build, Metafile } from 'esbuild';
import { readFile, writeFile } from 'fs/promises';
import { getSwBuildConfig, NgSwBuildOptions } from './build';
import { NgSwExecutorSchema } from './schema';
import { extractManifest, mergeMetaFiles } from './process-meta-files';

const swPluginPath = 'tools/custom-nx/src/executors/ng-sw/service-worker.plugin.ts';

async function* ngServiceWorkerBuilder(
  options: NgSwExecutorSchema,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean; }> {

  if (!context.projectGraph)
    throw new Error('cannot find project graph');

  const target = parseTargetString(options.buildTarget, context.projectGraph);

  const buildOptions = readTargetOptions(target, context);

  const statsPath = `${buildOptions.outputPath}/stats.json`;
  const buildMeta = await (async () => {
    const text = await readFile(statsPath, 'utf-8');
    const meta: Metafile = JSON.parse(text);
    return meta;
  })();
  const manifest = extractManifest(buildOptions.browser, buildMeta);

  const swPlugin = buildOptions.plugins?.find((p: any) => p.path === swPluginPath);
  if (!swPlugin)
    throw new Error('could not find the esbuild plugin for the service worker');
  const swOptions = swPlugin.options as NgSwBuildOptions;

  const swBuild = await build({
    ...getSwBuildConfig(
      swOptions,
      manifest,
      'false'
    ),
    sourcemap: false,
    absWorkingDir: context.cwd,
    outdir: `${buildOptions.outputPath}/browser`,
    write: true
  });

  if (!swBuild.metafile)
    throw new Error('no metafile in sw build');

  mergeMetaFiles(buildMeta, swBuild.metafile);
  await writeFile(statsPath, JSON.stringify(buildMeta, null, 2));

  return yield {
    success: true
  };

}

export default ngServiceWorkerBuilder;
