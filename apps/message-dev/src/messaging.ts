import { FastifyPluginAsync } from 'fastify';
import { MessageRoom, User } from '@easworks/models';

export const messaging: FastifyPluginAsync = async server => {

  server.io.on("connection", (socket) => {
    const { token } = socket.handshake.auth;
    if (!token) {
      socket.emit('error', 'auth token missing');
      socket.disconnect(true);
    }

    const context = {
      user: validateTokenAndGetUser(token)
        .catch(e => {
          socket.emit('error', 'auth token invalid');
          socket.disconnect(true);
          throw e;
        }),
      token
    } as const;

    socket.on('getRooms', async ({ nonce }, callback) => {
      const user = await context.user;
      const rooms = await getRoomsForUser(user._id);
      callback({
        nonce,
        rooms
      });
    });
  });
};

declare function validateTokenAndGetUser(token: string): Promise<User>;

declare function getRoomsForUser(userId: string): Promise<MessageRoom[]>;