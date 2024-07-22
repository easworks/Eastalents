import { authValidators } from 'models/validators/auth';
import { SignupEmailInUse } from 'server-side/errors/definitions';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from '../mongodb';

export const authHandlers: FastifyZodPluginAsync = async server => {

  server.route({
    method: 'POST',
    url: '/signup/email',
    schema: {
      body: authValidators.inputs.signup.email
    },
    handler: async (req, rep) => {

      const input = req.body;

      const emailExists = await easMongo.userCredentials.findOne({
        provider: { email: input.email }
      });

      if (emailExists)
        throw new SignupEmailInUse();

      return input;

      // const session  = easMongo.client.startSession();

      // await session.withTransaction(async () => {
      //   const user: User = {
      //     _id: null as unknown as string,
      //     email: input.email,
      //     enabled: true,
      //     firstName: input.firstName,
      //     lastName: input.lastName,
      //     verified: false,
      //   };
      // })




      // return user;
    }
  });

};