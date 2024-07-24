import { Entity } from './entity';

export interface User extends Entity {
  verified: boolean;
  enabled: boolean;

  nickname: string;
  email: string;

  firstName: string;
  lastName: string;
  imageUrl: string | null;
}

export interface TokenPayload {
}

export interface UserWithToken extends User {
  isNew: boolean;
  token: string;
}
