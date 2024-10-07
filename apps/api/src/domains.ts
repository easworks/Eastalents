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

  server.post('/data',
    async req => {
      const value = req.body;
      const doc = await req.ctx.em.findOne(keyval_schema, 'domain-data');
      if (!doc)
        throw new KeyValueDocumentNotFound('domain-data');
      doc.value = value;

      req.ctx.em.flush();

      return true;
    }
  );

  server.get('/featured-domains',
    async (req) => {
      const doc = await req.ctx.em.findOne(keyval_schema, 'featured-domains');
      if (!doc)
        throw new KeyValueDocumentNotFound('featured-domains');

      return doc.value;
    }
  );

  server.post('/featured-domains',
    async req => {
      const value = req.body;
      const doc = await req.ctx.em.findOne(keyval_schema, 'featured-domains');
      if (!doc)
        throw new KeyValueDocumentNotFound('featured-domains');
      doc.value = value;

      req.ctx.em.flush();

      return true;
    }
  );

  server.get('/industries',
    async (req) => {
      const doc = await req.ctx.em.findOne(keyval_schema, 'industries');
      if (!doc)
        throw new KeyValueDocumentNotFound('industries');

      return doc.value;
    }
  );
};