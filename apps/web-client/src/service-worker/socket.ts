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
        const args = event.data.args;
        socket.emit(args, (result: unknown) => event.ports[0].postMessage(result));
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
