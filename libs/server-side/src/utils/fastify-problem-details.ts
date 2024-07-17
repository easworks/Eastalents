import { ErrorWithMetadata, ProblemDetails } from '@easworks/models/problem-details';
import { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { ValidationFailed } from '../errors/definitions';

const contentType = 'application/problem+json';

export const useProblemDetailsGlobally: FastifyPluginAsync = async (server) => {
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
