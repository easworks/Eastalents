export const RETURN_URL_KEY = 'returnUrl';

export type SocialIdp = 'google' | 'linkedin' | 'github';

export interface SocialAuthRequest {
  provider: SocialIdp;
  code: string;
}

export interface EmailAuthRequest {
  email: string;
  password: string;
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

export interface SocialCallbackStateBase {
  [RETURN_URL_KEY]?: string;
}

export interface GoogleCallbackState extends SocialCallbackStateBase {
  provider: 'google',
}

export type SocialCallbackState = GoogleCallbackState;
