import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO);

server.ready().then(() => {
  console.debug('ready');

  server.io.on("connection", (socket) => {
    console.debug('new socket');

    const token = socket.handshake.headers.authorization?.split('Bearer ')[0];

    console.debug(token);

    if (!token) {
      socket.emit('error', 'auth token missing');
      socket.disconnect(true);
    }


  });
});

server.listen({ port: 4201 });