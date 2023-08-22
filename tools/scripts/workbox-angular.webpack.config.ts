import { Compilation, Compiler, Configuration } from 'webpack';
import { InjectManifest } from 'workbox-webpack-plugin';
import { WebpackInjectManifestOptions } from 'workbox-build';
import * as path from 'node:path';
import { DateTime } from 'luxon';

class MyWorkboxPlugin extends InjectManifest {

  constructor(config: WebpackInjectManifestOptions) {
    super(config);
  }

  private readonly plugin_name = this.constructor.name;

  override apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      this.plugin_name,
      compilation => {
        this.nameServiceWorkerChunk(compilation);
        this.addIndexAndManifestEntries(compilation);
      }
    );
    super.apply(compiler);
  }

  override async performChildCompilation(compilation: Compilation, parentCompiler: Compiler): Promise<void> {
    // stub
  }

  override addSrcToAssets(compilation: Compilation, parentCompiler: Compiler): void {
    // stub
  }

  private nameServiceWorkerChunk(compilation: Compilation) {
    if (!compilation.options.context || !this.config?.swSrc)
      throw new Error('Either context or service worker source is not specified');
    const sw_src_path = path.resolve(
      compilation.options.context,
      this.config.swSrc
    );

    compilation.hooks.moduleIds.tap(
      this.plugin_name,
      modules => {
        for (const module of modules) {
          if (module.identifier().includes(sw_src_path)) {
            for (const chunk of compilation.chunks) {
              if (compilation.chunkGraph.isModuleInChunk(module, chunk)) {
                if (this.config.swDest)
                  chunk.filenameTemplate = this.config.swDest;
                break;
              }
            }
            break;
          }
        }
      }
    );
  }

  private addIndexAndManifestEntries(compilation: Compilation) {
    compilation.hooks.afterHash.tap(
      this.plugin_name,
      () => {
        const revision = DateTime.now().toMillis().toString();
        this.config.additionalManifestEntries = [
          { url: 'index.html', revision }
        ];
      }
    );
  }


}

export default async function (
  src: string,
  dest: string,
  config: Configuration
) {
  config.plugins?.push(new MyWorkboxPlugin({
    mode: config.mode,
    swSrc: src,
    swDest: dest,
    compileSrc: false,
    chunks: ['main', 'styles', 'polyfills'],
    maximumFileSizeToCacheInBytes: 20 * 1024 * 1024
  }));
}