import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { authHook } from './auth/hooks';
import { environment } from './environment';
import { easMongo } from './mongodb';

export const developmentHandlers: FastifyZodPluginAsync = async server => {

  if (environment.id === 'production')
    return;

  server.post('/delete-account',
    { 'onRequest': authHook() },
    async (req) => {
      const id = req.ctx.auth!._id;
      if (!id) throw new Error();

      return deleteUser(id);
    });
};

export async function deleteUser(_id: string) {
  const user = await easMongo.users.findOne({ _id });
  if (!user)
    throw new Error('user not found');

  await Promise.all([
    easMongo.tokens.deleteMany({ userId: user._id }),
    easMongo.oauthCodes.deleteMany({ userId: user._id }),
    easMongo.userCredentials.deleteMany({ userId: user._id }),
    easMongo.permissions.deleteOne({ _id: user._id }),
    easMongo.users.deleteOne({ _id: user._id })
  ]);
}