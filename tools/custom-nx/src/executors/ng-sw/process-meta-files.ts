import { ImportKind, Metafile } from 'esbuild';

export function extractManifest(main: string, metaFile: Metafile) {

  const files = new Set(['/']);

  for (const outputName in metaFile.outputs) {
    const file = metaFile.outputs[outputName];
    if (file.entryPoint === main) {
      extractImportChain(files, metaFile, {
        name: outputName,
        followImport: 'import-statement',
      });
    }
    else if (file.entryPoint === 'angular:styles/global:styles') {
      extractImportChain(files, metaFile, {
        name: outputName,
        followImport: 'import-rule',
      });
    }
  }

  const revision = new Date()
    .valueOf()
    .toString();

  return [...files].sort().map(url => ({ url, revision }));;
}

export function mergeMetaFiles(a: Metafile, b: Metafile) {
  return {
    inputs: Object.assign(a.inputs, b.inputs),
    outputs: Object.assign(a.outputs, b.outputs)
  };
}

function extractImportChain(
  files: Set<string>,
  metaFile: Metafile,
  opts: {
    name: string,
    followImport: ImportKind,
    external?: boolean;
  }

) {
  const { name } = opts;
  if (files.has(name)) {
    return;
  }
  files.add(name);
  if (opts.external)
    return;

  const file = metaFile.outputs[name];
  file.imports.filter(i => i.kind === opts.followImport)
    .forEach(i => extractImportChain(
      files,
      metaFile,
      {
        name: i.path,
        followImport: opts.followImport,
        external: i.external
      }));
}
