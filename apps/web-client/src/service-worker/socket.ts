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
        const { event, payload, response, broadcast } = data;

        socket.emit(event, payload);

        if (response) {
          socket.once(response, (result: unknown) => {
            if (broadcast) {
              self.clients.matchAll({ type: 'all' })
                .then(clients => clients.forEach(client =>
                  client.postMessage({
                    type: 'SOCKET',
                    event: response,
                    payload: result
                  })
                ));
              ports[0].postMessage(undefined);
            }
            else {
              ports[0].postMessage(result);
            }
          });
        }
        else {
          ports[0].postMessage(undefined);
        }
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
