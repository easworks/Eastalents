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

interface UserClaimsBase {
  type: string;
  _id: string;
}

export interface ThirdPartyUserClaims extends UserClaimsBase {
  type: 'third-party';
  roles: string[];
}

export interface FirstPartyUserClaims extends UserClaimsBase {
  type: 'first-party';
  roles: string[];
  permissions: string[];
}

export type UserClaims = FirstPartyUserClaims | ThirdPartyUserClaims;