import { Entity } from './entity';

export const MAGIC_UNSET_NICKNAME = '__UNSET__';

export interface User extends Entity {
  verified: boolean;
  enabled: boolean;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
}

export interface UserWithToken extends User {
  isNew: boolean;
  token: string;
}
