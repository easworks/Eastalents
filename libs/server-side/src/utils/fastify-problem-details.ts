import { ValidationFailed } from '../errors/definitions';
import { FastifyInstance } from 'fastify';
import { ErrorWithMetadata, ProblemDetails } from '@easworks/models/problem-details';
import { ZodError } from 'zod';

const contentType = 'application/problem+json';

export function useProblemDetailsGlobally(server: FastifyInstance) {
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
}
