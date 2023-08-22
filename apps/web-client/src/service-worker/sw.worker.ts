import { setupCaching } from './caching';
import { setupUpdates } from './updates';

self.__WB_DISABLE_DEV_LOGS = true;

setupCaching('new-town-property-registration-web-client');
setupUpdates();
