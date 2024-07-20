import { DateTime } from 'luxon';
import { customAlphabet } from 'nanoid';

export interface ClientApplication {
  id: string;
  name: string;
  redirectUris: string[];
}

export interface AuthCode {
  value: string;
  clientId: string;
  uid: string;
  challenge: {
    code: string;
    method: 'plain' | 'S256';
  };
  redirectUri: string;
  expiresAt: DateTime;
}

const codeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890';
export const oauthCodeGenerator = customAlphabet(codeAlphabet, 32);