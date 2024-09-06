import { Entity } from './entity';

export const RETURN_URL_KEY = 'returnUrl';

export interface TokenRef extends Entity {
  expiresIn: number;
  userId: string;
}

export interface EmailVerificationCodeRef extends Entity {
  expiresIn: number;
  email: string;
  code: string;
  pkce: string;
}

export interface PasswordResetCodeRef extends Entity {
  expiresIn: number;
  email: string;
  code: string;
  pkce: string;
}