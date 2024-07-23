import { Entity } from './entity';

export const RETURN_URL_KEY = 'returnUrl';

export interface TokenRef extends Entity {
  expiresIn: number;
}