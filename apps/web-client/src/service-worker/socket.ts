import { io } from 'socket.io-client';

declare const self: ServiceWorkerGlobalScope;

const socket = io('https://eas-works.onrender.com/', {
  autoConnect: false,
  transports: ['websocket']
});

export function setupSocket() {
  self.addEventListener('message', async (event) => {
    switch (event.data?.type) {
      case 'SOCKET': {
        if (socket.disconnected)
          socket.connect();
        const { name, args, response } = event.data.payload;
        socket.emit(name, args);
        if (response)
          socket.once(response, (results: unknown) => event.ports[0].postMessage(results));
        else
          event.ports[0].postMessage(undefined);
      } break;
      default: break;
    }
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
