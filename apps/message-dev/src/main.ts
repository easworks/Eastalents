import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { getUserFromToken } from './context';

const server = fastify();
server.register(fastifyIO);

export async function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

server.ready().then(() => {
  console.debug('ready');

  server.io.on("connection", (socket) => {
    const { token } = socket.handshake.auth;
    if (!token) {
      socket.emit('error', 'auth token missing');
      socket.disconnect(true);
    }

    const context = {
      auth: getUserFromToken(token)
    };

    socket.on('getRooms', async (callback) => {
      console.debug('getRooms');
      await sleep(3000);
      callback(context);
    });
  });
});

server.listen({ port: 4201 });
