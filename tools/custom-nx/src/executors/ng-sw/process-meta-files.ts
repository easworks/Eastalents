import { ImportKind, Metafile } from 'esbuild';

export function extractManifest(main: string, metaFile: Metafile) {

  const files = new Set(['index.html']);

  function addToList(name: string, followImport: ImportKind, external?: boolean) {
    if (files.has(name)) {
      return;
    }
    files.add(name);
    if (external)
      return;

    const file = metaFile.outputs[name];
    file.imports.filter(i => i.kind === followImport)
      .forEach(i => addToList(i.path, followImport, i.external));
  }

  for (const outputName in metaFile.outputs) {
    const file = metaFile.outputs[outputName];
    if (file.entryPoint === main) {
      addToList(outputName, 'import-statement');
    }
    else if (file.entryPoint === 'angular:styles/global:styles') {
      addToList(outputName, 'import-rule');
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
