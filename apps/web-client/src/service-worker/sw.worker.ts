import { setupCaching } from './caching';
import { setupSocket } from './socket';
import { setupUpdates } from './updates';
import { setupUserContext } from './user';

self.__WB_DISABLE_DEV_LOGS = true;

setupUserContext();

setupCaching('eastalents-web-client');
setupUpdates();
setupSocket();
