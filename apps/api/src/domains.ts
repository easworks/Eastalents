import { FastifyZodPluginAsync } from 'server-side/utils/fastify-zod';
import { easMongo } from './mongodb';
import { KeyValueDocumentNotFound } from 'server-side/errors/definitions';

export const domainHandlers: FastifyZodPluginAsync = async server => {
  server.get('/data',
    async () => {
      const doc = await easMongo.keyval.get('domain-data');
      if (!doc)
        throw new KeyValueDocumentNotFound('domain-data');

      return doc.value;
    }
  );
};