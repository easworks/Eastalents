declare const self: ServiceWorkerGlobalScope;

export function setupUpdates() {
  self.addEventListener('message', async (event) => {
    switch (event.data?.type) {
      case 'SKIP_WAITING':
        await self.skipWaiting();
        event.ports[0].postMessage(true);
        break;
      case 'CLAIM_CLIENTS':
        await self.clients.claim();
        event.ports[0].postMessage(true);
        break;
      default: break;
    }
  });
}
