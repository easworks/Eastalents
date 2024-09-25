import { BuildOptions } from 'esbuild';

export interface NgSwBuildOptions {
  src: string,
  destination: string,
  tsconfig: string;
}

export function getSwBuildConfig(
  options: NgSwBuildOptions,
  manifest: {
    url: string;
    revision: string;
  }[],
  ngDevMode: string
): BuildOptions {
  return {
    entryPoints: [
      { out: options.destination, in: options.src }
    ],
    entryNames: '[name]',
    bundle: true,
    platform: 'browser',
    metafile: true,
    format: 'esm',
    tsconfig: options.tsconfig,
    write: false,
    define: {
      'ngDevMode': ngDevMode || 'undefined',
      'self.__WB_MANIFEST': JSON.stringify(manifest),
    }
  };
}