import { Metafile } from 'esbuild';

export function extractManifest(main: string, metaFile: Metafile) {

  const files: string[] = [
    'index.html'
  ];

  for (const outputName in metaFile.outputs) {
    const file = metaFile.outputs[outputName];
    if (file.entryPoint === main) {
      files.push(outputName);
      for (const i of file.imports) {
        if (i.kind === 'import-statement')
          files.push(i.path);
      }
    }
    else if (file.entryPoint === 'angular:styles/global:styles') {
      files.push(outputName);
    }
  }

  const revision = new Date()
    .valueOf()
    .toString();

  return files.map(url => ({ url, revision }));;
}