import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { ApiError } from './utils';

export class ValidationFailed extends ApiError {
  constructor(err: ZodError) {
    super('validation-failed', StatusCodes.BAD_REQUEST);

    this.metadata['issues'] = err.issues;
  }
}

export class InvalidOAuthClientID extends ApiError {
  constructor() {
    super('invalid-oauth-client-id', StatusCodes.BAD_REQUEST);
  }
}

export class InvalidRedirectUri extends ApiError {
  constructor() {
    super('invalid-redirect-uri', StatusCodes.BAD_REQUEST);
  }
}

export class InvalidOAuthCode extends ApiError {
  constructor() {
    super('invalid-oauth-code', StatusCodes.BAD_REQUEST);
  }
}

export class Unauthorized extends ApiError {
  constructor() {
    super('unauthorized', StatusCodes.UNAUTHORIZED);
  }
}

export class Forbidden extends ApiError {
  constructor() {
    super('forbidden',
      StatusCodes.FORBIDDEN);
  }
}
