import addWorkbox from '../../tools/scripts/workbox-angular.webpack.config';
import { Configuration } from 'webpack';

export default function (config: Configuration) {

  // so that markdown worker can use the proper entry point for dependencies
  // when inside a webworker
  config.resolve?.conditionNames?.push('worker');

  addWorkbox(
    'apps/web-client/src/service-worker/sw.worker.ts',
    'eastalents-web-client.sw.js',
    config
  );
  return config;
}
