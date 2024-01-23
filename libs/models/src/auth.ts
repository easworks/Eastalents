import { Role } from './user';

export const RETURN_URL_KEY = 'returnUrl';

export type SocialIdp = 'google' | 'linkedin' | 'github';

export function socialIdpName(idp: SocialIdp) {
  switch (idp) {
    case 'google': return 'Google';
    case 'linkedin': return 'LinkedIn';
    case 'github': return 'GitHub';
  }
}

interface SignUpDetails {
  firstName: string;
  lastName: string;
  email: string;
  userRole: Role;
}

export interface EmailSignUpRequest extends SignUpDetails {
  password: string;
}

export interface EmailSignInRequest {
  email: string;
  password: string;
}

interface SocialCodeParams {
  code: string;
  provider: SocialIdp;
}


interface SocialSignUpBase {
  authType: 'signup',
  userRole: Role;
}

export type SocialSignUpWithCode = SocialSignUpBase & SocialCodeParams;
export type SocialSignUpWithDetails = SocialSignUpBase & SignUpDetails;

export type SocialSignUpRequest = SocialSignUpWithCode | SocialSignUpWithDetails;

export interface SocialSignInRequest {
  authType: 'signin';
  code: string;
  provider: SocialIdp;
}


export interface SocialCallbackState {
  [RETURN_URL_KEY]?: string;
  request: SocialSignUpWithCode | SocialSignInRequest;
  challenge?: string;
}

/** Auth Code was exchanged succesfully, but email is not in our DB */
export interface SocialUserNotInDB {
  firstName?: string;
  lastName?: string;
  email: string;
}