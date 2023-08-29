import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { getUserFromToken } from './context';

const server = fastify();
server.register(fastifyIO);

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

    socket.on('getRooms', () => {
      return context;
    });
  });
});

server.listen({ port: 4201 });
