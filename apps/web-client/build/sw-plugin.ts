// eslint-disable-next-line @nx/enforce-module-boundaries
import { swPlugin } from '../../../tools/sw-plugin';

const projectRoot = 'apps/web-client';
const config = {
  src: `${projectRoot}/src/service-worker/sw.worker.ts`,
  destination: 'eastalents-web-client.sw',
  tsconfig: `${projectRoot}/tsconfig.worker.json`
};

export default swPlugin(config);
