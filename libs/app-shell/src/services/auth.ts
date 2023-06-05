import { Injectable, inject } from '@angular/core';
import { AuthNotFound, GoogleCallbackState, SocialCallbackState } from '@easworks/models';
import { AccountApi } from '../api';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly api = {
    account: inject(AccountApi)
  } as const;

  readonly signin = {
    github: () => {
      console.debug('[SIGN IN] Github');
    },
    linkedIn: () => {
      console.debug('[SIGN IN] LinkedIn');
    },
    google: (returnUrl?: string) => {
      console.debug('[SIGN IN] Google');
      const authUrl = constructGoogleAuthUrl();
      const state = JSON.stringify({
        provider: 'google',
        returnUrl
      } satisfies GoogleCallbackState);
      authUrl.searchParams.set('state', state);

      console.debug(authUrl.href);
    },
    email: () => {
      console.debug('[SIGN IN] Email');
    }
  } as const;

  handleSignIn(token: string, returnUrl?: string) {
    console.debug(token);
  }

  handlePartialSocialSignIn(provider: SocialCallbackState['provider'], data: AuthNotFound) {
    // 
  }
}




function constructGoogleAuthUrl() {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', `https://eas-works.onrender.com/api/gmail/callback`);
  authUrl.searchParams.set('client_id', '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com');
  authUrl.searchParams.set('scope', 'email profile');
  return authUrl;
}