import { ErrorWithMetadata, ProblemDetails } from '@easworks/models/problem-details';
import { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { ZodError } from 'zod';
import { ValidationFailed } from '../errors/definitions';

const contentType = 'application/problem+json';

const pluginImpl: FastifyPluginAsync = async (server) => {
  server.setErrorHandler(async (err, req, reply) => {

    const problemDetails = (() => {
      if (err instanceof ErrorWithMetadata)
        return err.toProblemDetails();

      if (err instanceof ZodError)
        return new ValidationFailed(err).toProblemDetails();

      return ProblemDetails.from(err);
    })();

    return reply
      .status(problemDetails.status)
      .type(contentType)
      .send(problemDetails);
  });
};

// need to do this, else the error handler is set on a child context;
export const useProblemDetailsGlobally = fastifyPlugin(pluginImpl);