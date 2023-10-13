import { BehaviorSubject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { user$ } from './user';

declare const self: ServiceWorkerGlobalScope;

const socket$ = new BehaviorSubject<Socket | null>(null);

export function setupSocket() {
  user$.subscribe(user => {
    const old = socket$.value;
    old?.disconnect();

    if (user) {
      console.debug(user);
      const socket = io('http://eas-prod-pipeline.eba-fhahuw9u.us-west-1.elasticbeanstalk.com', {
        autoConnect: false,
        auth: {
          token: user.token
        },
        transports: ['websocket']
      });

      socket.onAny((event, ...args: []) => {
        console.debug(event, args);
      });

      socket.onAnyOutgoing((event, ...args: []) => {
        console.debug(event, args);
      });

      socket$.next(socket);
    }
    else {
      socket$.next(null);
    }
  });

  self.addEventListener('message', async ({ data, ports }) => {
    switch (data?.type) {
      case 'SOCKET': {
        const socket = socket$.value;
        if (!socket)
          return;

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
    const socket = socket$.value;
    if (!socket)
      return;

    const tabs = await self.clients.matchAll({ type: 'window' });

    if (tabs.length === 0 && socket.connected) {
      socket.disconnect();
    }
  }, 60000);
}
