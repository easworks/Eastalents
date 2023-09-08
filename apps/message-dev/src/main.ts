import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { environment } from './environment';
import { handlers } from './handlers';
import { socketTesting } from './socket-testing';

const { port } = environment;

const server = fastify();

server.register(fastifyIO);

server.register(socketTesting);

server.register(handlers);

server.ready().then(() => console.debug(`server listening on port: ${port}`));

server.listen({ port });
