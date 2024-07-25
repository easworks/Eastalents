import { StatusCodes } from 'http-status-codes';
import { OAuthAuthorizeErrorType, OAuthTokenErrorType } from 'models/oauth';
import { ZodError } from 'zod';
import { ApiError } from './utils';

export class ValidationFailed extends ApiError {
  constructor(err: ZodError) {
    super('validation-failed', StatusCodes.BAD_REQUEST);

    this.metadata['issues'] = err.issues;
  }
}

export class KeyValueDocumentNotFound extends ApiError {
  constructor(key: string) {
    super('key-value-document-not-found', StatusCodes.INTERNAL_SERVER_ERROR);
    this.metadata['docment'] = key;
  }
}

export class InvalidBearerToken extends ApiError {
  constructor(message: string) {
    super('invalid-bearer-token', StatusCodes.UNAUTHORIZED);
    this.metadata['reason'] = message;
  }
}

export class InvalidOAuthCode extends ApiError {
  constructor() {
    super('invalid-oauth-code', StatusCodes.BAD_REQUEST);
  }
}

export class OAuthRequestError<T extends
  OAuthAuthorizeErrorType |
  OAuthTokenErrorType |
  'invalid-client-id' |
  'invalid-redirect-uri'
> extends ApiError {
  constructor(
    public readonly error: T,
    public readonly redirect_uri?: string
  ) {
    super('oauth-request-error', StatusCodes.BAD_REQUEST);
    this.metadata['oauth-error'] = error;
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

export class SignupRoleIsInvalid extends ApiError {
  constructor() {
    super('signup-role-is-invalid', StatusCodes.BAD_REQUEST);
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

export class UserNeedsEmailVerification extends ApiError {
  constructor() {
    super('user-needs-email-verification', StatusCodes.BAD_REQUEST);
  }
}

export class UserIsDisabled extends ApiError {
  constructor() {
    super('user-is-disabled', StatusCodes.FORBIDDEN);
  }
}

export class UserNotFound extends ApiError {
  constructor() {
    super('user-not-found', StatusCodes.NOT_FOUND);
  }
}

export class UserNicknameInUse extends ApiError {
  constructor() {
    super('user-nickname-in-use', StatusCodes.BAD_REQUEST);
  }
}

export class UserEmailNotRegistered extends ApiError {
  constructor() {
    super('user-email-not-registered', StatusCodes.UNAUTHORIZED);
  }
}

export class InvalidPassword extends ApiError {

  constructor() {
    super('invalid-password', StatusCodes.UNAUTHORIZED);
  }
}