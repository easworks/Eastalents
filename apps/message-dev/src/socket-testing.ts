import { FastifyPluginAsync } from 'fastify';
import { sleep } from './sleep';

export const socketTesting: FastifyPluginAsync = async server => {
  // 
  server.io.on('connection', socket => {
    socket.emit('connected');

    socket.on('event-1', async ({ nonce }, callback) => {
      const start = Date.now();
      await sleep(Math.random() * 10000);
      const end = Date.now();
      callback({ nonce, start, end, total: end - start });
    });
  });
};
