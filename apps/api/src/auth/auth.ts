import { authValidators } from 'models/validators/auth';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';

export const authHandlers: FastifyZodPluginAsync = async server => {

  server.route({
    method: 'POST',
    url: '/signup/email',
    schema: {
      body: authValidators.inputs.signup.email
    },
    handler: async (req, rep) => {
      return req.body;
    }
  });

};