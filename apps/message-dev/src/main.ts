import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { handlers } from './verify-software-images';
import { messaging } from './messaging';
import { environment } from './environment';

const { port } = environment;

const server = fastify();

server.register(fastifyIO);

server.register(messaging);

server.register(handlers);

server.ready().then(() => console.debug(`server listening on port: ${port}`));

server.listen({ port });
