import { setCacheNameDetails } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare const self: ServiceWorkerGlobalScope;

export function setupCaching(cachePrefix: string) {
  setCacheNameDetails({
    prefix: cachePrefix,
    suffix: ''
  });

  cleanupOutdatedCaches();

  const manifest = self.__WB_MANIFEST ?? [];

  precacheAndRoute(manifest);


  registerRoute(new NavigationRoute(
    createHandlerBoundToURL('/index.html')
  ));

}

