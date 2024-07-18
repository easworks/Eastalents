import { cacheNames, setCacheNameDetails } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, Route, registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

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
    createHandlerBoundToURL('/?__blank_page')
  ));

  registerRoute(new Route(
    ({ sameOrigin, url }) => {
      return sameOrigin && url.pathname.startsWith('/assets/');
    },
    new StaleWhileRevalidate({
      cacheName: formatCacheName('assets')
    })
  ));

  registerRoute(
    new Route(
      ({ sameOrigin, url }) => {
        return sameOrigin && (
          url.pathname.endsWith('.js') ||
          url.pathname.endsWith('.css')
        );
      },
      new StaleWhileRevalidate()
    ),
  );

}

export function formatCacheName(name: string) {
  if (cacheNames.prefix)
    name = `${cacheNames.prefix}-${name}`;
  if (cacheNames.suffix)
    name = `${name}-${cacheNames.suffix}`;

  return name;
}
