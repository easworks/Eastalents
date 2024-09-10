import { DateTime } from 'luxon';
import { Entity } from './entity';
import { User } from './user';

export const RETURN_URL_KEY = 'returnUrl';

export interface TokenRef extends Entity {
  expiresAt: DateTime;
  user: User;
}

export interface EmailVerificationCodeRef extends Entity {
  expiresAt: DateTime;
  email: string;
  code: string;
  pkce: string;
}

export interface PasswordResetCodeRef extends Entity {
  expiresAt: DateTime;
  email: string;
  code: string;
  pkce: string;
}