import { DateTime } from 'luxon';
import { Entity } from './entity';
import { User } from './user';

export interface OAuthClientApplication extends Entity {
  name: string;
  redirectUris: string[];
  firstParty: boolean;
}

export interface OAuthCode extends Entity {
  value: string;
  client: OAuthClientApplication;
  user: User;
  challenge?: {
    code: string;
    method: 'plain' | 'S256';
  };
  redirectUri?: string;
  expiresAt: DateTime;
  grantedTokens: string[];
}

export interface OAuthTokenSuccessResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token?: string;
  scope?: string;

  [key: string]: unknown;
}

interface OAuthErrorResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
}

export type OAuthAuthorizeErrorType =
  'invalid_request' |
  'unauthorized_client' |
  'access_denied' |
  'unsupported_response_type' |
  'invalid_scope' |
  'server_error' |
  'temporarily_unavailable';


export interface OAuthAuthorizeErrorResponse extends OAuthErrorResponse {
  error: OAuthAuthorizeErrorType;
  state?: unknown;
}

export type OAuthTokenErrorType =
  'invalid_request' |
  'invalid_client' |
  'invalid_grant' |
  'unauthorized_client' |
  'unsupported_grant_type' |
  'invalid_scope';

export interface OAuthTokenErrorResponse extends OAuthErrorResponse {
  error: OAuthTokenErrorType;
}
