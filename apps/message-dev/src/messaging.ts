import { FastifyPluginAsync } from 'fastify';
import { getUserFromToken } from './context';

export const messaging: FastifyPluginAsync = async server => {
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
};
