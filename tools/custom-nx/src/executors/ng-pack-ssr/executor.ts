import { parseTargetString, PromiseExecutor, readTargetOptions } from '@nx/devkit';
import { Metafile } from 'esbuild';
import { readFile, writeFile } from 'fs/promises';
import { PackageJson } from 'nx/src/utils/package-json';
import { NgPackSsrExecutorSchema } from './schema';
import { exec, spawn, spawnSync } from 'child_process';

const runExecutor: PromiseExecutor<NgPackSsrExecutorSchema> = async (
  options,
  context
) => {
  if (!context.projectGraph)
    throw new Error('cannot find project graph');


  const target = parseTargetString(options.buildTarget, context.projectGraph);

  const buildOptions = readTargetOptions(target, context);

  console.log('analyzing...');

  const statsPath = `${buildOptions.outputPath}/stats.json`;
  const buildMeta = await (async () => {
    const text = await readFile(statsPath, 'utf-8');
    const meta: Metafile = JSON.parse(text);
    return meta;
  })();

  const { main, packages } = extractPackages(buildMeta, buildOptions.server);

  console.log('generating package.json...');

  const rootPkg: PackageJson = await import(`${context.root}/package.json`);
  const allDeps = rootPkg.dependencies || {};
  const resolved = packages.map(d => [d, allDeps[d]]);

  const outPkg: PackageJson = {
    name: 'eastalents-web-client-ssr',
    version: rootPkg.version,
    main,
    dependencies: Object.fromEntries(resolved),
  };

  await writeFile(
    `${buildOptions.outputPath}/server/package.json`,
    JSON.stringify(outPkg, null, 2),
    'utf-8'
  );

  console.log('generating pnpm-lock.yaml...');
  await new Promise<void>(resolve => {
    const task = spawn(
      'pnpm', ['i', '--lockfile-only'],
      {
        cwd: `${buildOptions.outputPath}/server`,
        stdio: 'inherit'
      });
    task.on('close', () => resolve());
  });

  return {
    success: true,
  };
};

export default runExecutor;

function extractPackages(meta: Metafile, server: string) {
  const packages = new Set<string>();

  let main = '';

  for (const outName in meta.outputs) {
    const file = meta.outputs[outName];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (file['ng-platform-server'] !== true)
      continue;

    if (file.entryPoint === server)
      main = outName;

    for (const imp of file.imports) {
      if (!imp.external)
        continue;

      packages.add(imp.path);
    }

  }

  return {
    main,
    packages: [...packages].sort()
  };
}
