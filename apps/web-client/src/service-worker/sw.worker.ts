import { setupCaching } from './caching';
import { setupUpdates } from './updates';
import { setupSocket } from './socket';

self.__WB_DISABLE_DEV_LOGS = true;

setupCaching('eastalents-web-client');
setupUpdates();
setupSocket();
