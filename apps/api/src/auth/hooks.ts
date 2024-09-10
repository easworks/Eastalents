import { FastifyRequest } from 'fastify';
import { AuthValidator } from 'server-side/auth/rules';
import { Forbidden, Unauthorized } from 'server-side/errors/definitions';

export const authHook = (validator?: AuthValidator) => {
  return async (req: FastifyRequest) => {
    const auth = req.ctx.auth;

    if (!auth)
      throw new Unauthorized();

    if (validator) {
      if (!validator(auth))
        throw new Forbidden();
    }

  };
};
