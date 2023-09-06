import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { environment } from './environment';
import { handlers } from './handlers';
import { messaging } from './messaging';

const { port } = environment;

const server = fastify();

server.register(fastifyIO);

server.register(messaging);

server.register(handlers);

server.ready().then(() => console.debug(`server listening on port: ${port}`));

server.listen({ port });
