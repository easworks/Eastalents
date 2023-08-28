import { io } from 'socket.io-client';

declare const self: ServiceWorkerGlobalScope;

const socket = io('https://eas-works.onrender.com/', {
  autoConnect: false,
  transports: ['websocket']
});

export function setupSocket() {
  self.addEventListener('message', async ({ data, ports }) => {
    switch (data?.type) {
      case 'SOCKET': {
        if (socket.disconnected)
          socket.connect();
        const { event, payload } = data;
        socket.emit(event, payload);
        ports[0].postMessage(undefined);
      } break;
      default: break;
    }
  });

  socket.onAny(async (event, payload) => {
    const clients = await self.clients.matchAll({ type: 'all' });
    clients.forEach(c =>
      c.postMessage({ type: 'SOCKET', event, payload }));
  });

  closeConnectionWhenNoClients();
}


function closeConnectionWhenNoClients() {
  setInterval(async () => {
    const tabs = await self.clients.matchAll({ type: 'window' });

    if (tabs.length === 0 && socket.connected) {
      socket.disconnect();
    }
  }, 60000);
}
