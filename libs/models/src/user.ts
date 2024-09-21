import { Entity } from './entity';

export type FirstPartyDomain = 'easworks' | 'easdevhub';

export interface User extends Entity {
  enabled: boolean;

  username: string;
  email: string;

  firstName: string;
  lastName: string;
  imageUrl: string | null;

  sourceDomain: FirstPartyDomain;
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

export interface InitialProfileData {
  domains: string[];
  softwareProducts: string[];
}