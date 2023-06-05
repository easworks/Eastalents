import { Injectable, inject } from '@angular/core';
import { EmailAuthRequest, GoogleCallbackState, RETURN_URL_KEY, SocialIdp, UserWithToken } from '@easworks/models';
import { Subject, map } from 'rxjs';
import { AccountApi } from '../api';
import { AuthState } from '../state';

export interface SignInMeta {
  isNewUser: boolean;
  [RETURN_URL_KEY]?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly state = inject(AuthState);
  private readonly api = {
    account: inject(AccountApi)
  } as const;

  readonly afterSignIn$ = new Subject<SignInMeta>();

  readonly signin = {
    github: () => {
      console.debug('[SIGN IN] Github');
    },
    linkedIn: () => {
      console.debug('[SIGN IN] LinkedIn');
    },
    google: (returnUrl?: string) => {
      console.debug('[SIGN IN] Google');
      const authUrl = AuthRedirect.getUrl('google');
      const state = JSON.stringify({
        provider: 'google',
        returnUrl
      } satisfies GoogleCallbackState);
      authUrl.searchParams.set('state', state);

      console.debug(authUrl.href);
    },
    email: (input: EmailAuthRequest, meta: SignInMeta) =>
      this.api.account.signIn.email(input)
        .pipe(map(r => {
          this.handleSignIn(r, meta);
        }))
  } as const;

  handleSignIn(user: UserWithToken, meta: SignInMeta) {
    this.state.user$.set(user);
    this.afterSignIn$.next(meta);
  }
}


interface AuthRedirectConfig {
  readonly url: string;
  readonly response_type: string;
  readonly redirect_uri: string;
  readonly client_id: string;
  readonly scope?: string;
}

class AuthRedirect {
  private static readonly configs: Readonly<Record<SocialIdp, AuthRedirectConfig>> = {
    google: {
      url: 'https://accounts.google.com/o/oauth2/v2/auth',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com',
      scope: 'email profile'
    },
    linkedin: {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com',
      scope: 'email profile'
    },
    github: {
      url: 'https://github.com/login/oauth/authorize',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com',
      scope: 'user:read'
    }
  };

  static getUrl(provider: SocialIdp) {
    const config = this.configs[provider];
    const authUrl = new URL(config.url);
    authUrl.searchParams.set('response_type', config.response_type);
    authUrl.searchParams.set('redirect_uri', config.redirect_uri);
    authUrl.searchParams.set('client_id', config.client_id);
    if (config.scope)
      authUrl.searchParams.set('scope', config.scope);
    return authUrl;
  }
}
