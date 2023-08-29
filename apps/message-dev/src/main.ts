import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO);

server.ready().then(() => {
  console.debug('ready');
  // we need to wait for the server to be ready, else `server.io` is undefined

  server.io.on("connection", (socket) => {
    console.debug('new socket');
  });
});

server.listen({ port: 4201 });