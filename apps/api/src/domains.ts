import { keyval_schema } from '@easworks/mongodb/schema/keyval';
import { KeyValueDocumentNotFound } from 'server-side/errors/definitions';
import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';

export const domainHandlers: FastifyZodPluginAsync = async server => {
  server.get('/data',
    async (req) => {
      const doc = await req.ctx.em.findOne(keyval_schema, 'domain-data');
      if (!doc)
        throw new KeyValueDocumentNotFound('domain-data');

      return doc.value;
    }
  );
};