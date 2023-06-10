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

/** User was found and token was returned */
export interface AuthSuccess {
  token: string;
}

/** Auth Code was exchanged succesfully, but email is not in our DB */
export interface AuthNotFound {
  firstName?: string;
  lastName?: string;
  email: string;
}

export type AuthResponse = AuthSuccess | AuthNotFound;

interface SignUpRequestBase {
  role: Role;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface SocialAuthRequestBase {
  code: string;
  provider: SocialIdp;
}

export interface SocialSignUpRequest extends SocialAuthRequestBase, SignUpRequestBase {
  authType: 'signup'
}

export interface SocialSignInRequest extends SocialAuthRequestBase {
  authType: 'signin';
}

export interface EmailSignUpRequest extends SignUpRequestBase {
  password: string;
}

export interface EmailSignInRequest {
  email: string;
  password: string;
}

export interface SocialCallbackState {
  [RETURN_URL_KEY]?: string;
  request: SocialSignUpRequest | SocialSignInRequest;
}
