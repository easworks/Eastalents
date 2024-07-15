import { parseTargetString, PromiseExecutor, readTargetOptions } from '@nx/devkit';
import { execSync, spawn } from 'child_process';
import { Metafile } from 'esbuild';
import { readFile, writeFile } from 'fs/promises';
import { PackageJson } from 'nx/src/utils/package-json';
import { NgPackSsrExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<NgPackSsrExecutorSchema> = async (
  options,
  context
) => {
  if (!context.projectGraph)
    throw new Error('cannot find project graph');


  const target = parseTargetString(options.buildTarget, context.projectGraph);

  const buildOptions = readTargetOptions(target, context);

  console.log('analyzing...\n');

  const statsPath = `${buildOptions.outputPath}/stats.json`;
  const buildMeta = await (async () => {
    const text = await readFile(statsPath, 'utf-8');
    const meta: Metafile = JSON.parse(text);
    return meta;
  })();

  const { main, packages } = extractPackages(buildMeta, buildOptions.ssr.entry);


  const rootPkg: PackageJson = await import(`${context.root}/package.json`);
  const allDeps = rootPkg.dependencies || {};
  const resolved = await getPackageVersions(packages, allDeps);

  console.log('\n\n');

  console.log('generating package.json...');
  const outPkg: PackageJson = {
    name: 'eastalents-web-client-ssr',
    version: rootPkg.version,
    main,
    type: 'module',
    dependencies: resolved,
  };

  await writeFile(
    `${buildOptions.outputPath}/server/package.json`,
    JSON.stringify(outPkg, null, 2),
    'utf-8'
  );

  console.log('\n\n');

  console.log('generating pnpm-lock.yaml...');
  await new Promise<void>((resolve, reject) => {
    const task = spawn(
      'pnpm', ['i', '--lockfile-only'],
      {
        cwd: `${buildOptions.outputPath}/server`,
        stdio: 'inherit'
      });
    task.on('close', () => resolve());
    task.on('error', (error) => reject(error));
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

async function getPackageVersions(packages: string[], allDeps: PackageJson['dependencies']) {
  if (!allDeps)
    throw new Error('invalid operation');

  const allDepKeys = Object.keys(allDeps);

  const getPackageName = async (packageName: string) => {
    if (packageName in allDeps)
      return packageName;
    const key = allDepKeys.find(k => packageName.startsWith(k));
    if (key)
      return key;

    try {
      await import(`node:${packageName}`);
      return undefined;
    }
    catch (e) {
      throw new Error(`could not find package version for '${packageName}'`);
    }

  };

  packages = await Promise.all(packages.map(p => getPackageName(p)))
    .then(names => names.filter((p): p is string => !!p));

  const pkgSet = new Set<string>();

  for (const pkgName of packages) {
    if (pkgSet.has(pkgName))
      continue;

    pkgSet.add(pkgName);
    console.debug(`- ${pkgName}`);

    const peers = await new Promise<string[]>((resolve, reject) => {
      try {
        const out = execSync(`pnpm info ${pkgName} peerDependencies --json`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          env: process.env
        });
        const peers = out ? Object.keys(JSON.parse(out)) : [];
        resolve(peers);
      }
      catch (e) {
        console.log(pkgName);
        reject(e);
      }
    });

    for (const peer of peers) {
      if (pkgSet.has(peer))
        continue;
      else
        packages.push(peer);
    }
  };

  return Object.fromEntries(
    packages
      .sort()
      .map(p => [p, allDeps[p]])
      .filter((e): e is [string, string] => !!e[1])
  );
}
