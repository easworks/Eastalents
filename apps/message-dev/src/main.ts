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
        .catch(e => {
          socket.emit('error', 'auth token invalid');
          socket.disconnect(true);
          throw e;
        })
    };

    socket.on('getRooms', async ({ nonce }, callback) => {
      const user = await context.auth;
      // const rooms = await getRooms(user.userId);
      const rooms = [] as string[];
      callback({
        nonce,
        rooms
      });
    });
  });
});

server.listen({ port: 4201 });
