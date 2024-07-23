import { DateTime } from 'luxon';
import { customAlphabet } from 'nanoid';
import { Entity } from './entity';

export interface ClientApplication {
  id: string;
  name: string;
  redirectUris: string[];
}

export interface AuthCode extends Entity {
  value: string;
  clientId: string;
  uid: string;
  challenge?: {
    code: string;
    method: 'plain' | 'S256';
  };
  redirectUri?: string;
  expiresAt: DateTime;
}

export interface OAuthTokenSuccessResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

type OAuthTokenErrorType =
  'invalid_request' |
  'invalid_client' |
  'invalid_grant' |
  'unauthorized_client' |
  'unsupported_grant_type' |
  'invalid_scope';

export interface OAuthTokenErrorResponse {
  error: OAuthTokenErrorType;
  error_description?: string;
  error_uri?: string;
}

const codeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890';
export const oauthCodeGenerator = customAlphabet(codeAlphabet, 32);