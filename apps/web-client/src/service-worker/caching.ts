import { cacheNames, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, Route, registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope & {
  __INDEX_URL: string;
};

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

  registerRoute(
    ({ request }) => request.url.startsWith('https://api.countrystatecity.in/v1'),
    new CacheFirst({
      cacheName: 'country-state-city',
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 3 * 24 * 60 * 60, // 3 DAYS
        }),
      ]
    })
  );

}

export function formatCacheName(name: string) {
  if (cacheNames.prefix)
    name = `${cacheNames.prefix}-${name}`;
  if (cacheNames.suffix)
    name = `${name}-${cacheNames.suffix}`;

  return name;
}
