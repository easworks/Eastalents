export const RETURN_URL_KEY = 'returnUrl';

export interface GoogleAuthRequest {
  code: string
}

export interface EmailAuthRequest {
  email: string;
  password: string;
}


export interface AuthSuccess {
  token: string;
}

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
