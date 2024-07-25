import { FastifyRequest } from 'fastify';
import { AuthValidator } from 'server-side/auth/rules';
import { CLOUD_CONTEXT_KEY } from '../context';
import { Forbidden, Unauthorized } from 'server-side/errors/definitions';

export const authHook = (validator?: AuthValidator) => {
  return async (req: FastifyRequest) => {
    const ctx = req.requestContext.get(CLOUD_CONTEXT_KEY);

    if (!ctx?.auth)
      throw new Unauthorized();

    if (validator) {
      if (!validator(ctx))
        throw new Forbidden();
    }

  };
};
