import { FastifyPluginAsync } from 'fastify';
import { oauthValidators } from 'models/validators/oauth';

export const oauthHandlers: FastifyPluginAsync = async server => {

  server.get('/authorize',
    { schema: { querystring: oauthValidators.inputs.authorize } },
    async (req) => {
      return req.query;
    }
  );

  server.post('/authorize',
    { schema: { body: oauthValidators.inputs.authorize } },
    async () => {
      // 
    }
  );


  server.get('/token',
    async () => {
      throw new Error('not implemented');
    });

};