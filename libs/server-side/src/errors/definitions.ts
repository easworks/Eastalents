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


export class SignupEmailInUse extends ApiError {
  constructor() {
    super('signup-email-in-use', StatusCodes.BAD_REQUEST);
  }
}

export class SignupRequiresWorkEmail extends ApiError {
  constructor(domain: string) {
    super('signup-requires-work-email', StatusCodes.BAD_REQUEST);
    this.metadata['invalidDomain'] = domain;
  }
}

export class UserNeedsPasswordReset extends ApiError {
  constructor() {
    super('user-needs-password-reset', StatusCodes.BAD_REQUEST);
  }
}

export class InvalidPassword extends ApiError {

  constructor() {
    super('invalid-password', StatusCodes.UNAUTHORIZED);
  }
}