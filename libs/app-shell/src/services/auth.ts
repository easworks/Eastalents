import { inject, Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RETURN_URL_KEY } from 'models/auth';
import { ExternalIdentityProviderType } from 'models/identity-provider';
import type { EmailSignInInput } from 'models/validators/auth';
import { first, from, switchMap, tap } from 'rxjs';
import { AuthApi } from '../api/auth.api';
import { OAuthApi } from '../api/oauth.api';
import { CLIENT_CONFIG } from '../dependency-injection';
import { authActions } from '../state/auth';
import { base64url } from '../utilities/base64url';
import { AuthRedirect } from './auth.external';
import { AuthStorageService } from './auth.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly storage = inject(AuthStorageService);
  private readonly actions$ = inject(Actions);
  private readonly oauth = inject(CLIENT_CONFIG).oauth;

  private readonly api = {
    oauth: inject(OAuthApi),
    auth: inject(AuthApi),
  } as const;

  public readonly signIn = {
    social: (provider: ExternalIdentityProviderType, returnUrl?: string) => {
      if (this.oauth.type !== 'server')
        throw new Error('social is only allowed from the easworks accounts server');
      const state = {
        idp: provider,
        [RETURN_URL_KEY]: returnUrl
      };
      return this.socialCodeExchange(provider, state);
    },
    email: (input: EmailSignInInput, returnUrl?: string) => {
      return this.api.auth.signin.email(input)
        .pipe(
          switchMap(response => this.handleSignIn(response.access_token, returnUrl))
        );
    },
    easworks: async (state?: string) => {
      const code = await codeChallenge.create();
      this.api.oauth.authorize(code, state);
    },
    oauthCode: (code: string, returnUrl?: string) => {
      const verifier = codeChallenge.get();

      return this.api.oauth.token(code, verifier)
        .pipe(
          switchMap(response => this.handleSignIn(response.access_token, returnUrl))
        );
    },
    token: (token: string, returnUrl?: string) => {
      return this.handleSignIn(token, returnUrl);
    }
  } as const;

  public readonly signUp = {
    social: (provider: ExternalIdentityProviderType, role: string, returnUrl?: string) => {
      if (this.oauth.type !== 'server')
        throw new Error('social is only allowed from the easworks accounts server');
      const state = {
        idp: provider,
        role,
        [RETURN_URL_KEY]: returnUrl
      };
      return this.socialCodeExchange(provider, state);
    }
  };

  async signOut() {
    this.store.dispatch(authActions.signOut({ payload: { revoked: false } }));
  }

  private handleSignIn(token: string, returnUrl?: string) {
    return from(this.storage.token.set(token))
      .pipe(
        tap(() => this.store.dispatch(authActions.idTokenChanged({
          payload: {
            token,
            loadUser: true
          }
        }))),
        switchMap(() => this.actions$),
        ofType(authActions.updateUser),
        first(),
        tap(() => this.store.dispatch(authActions.signIn({
          payload: {
            returnUrl: returnUrl || null
          }
        })))
      );
  }

  private socialCodeExchange(provider: ExternalIdentityProviderType, state: unknown) {
    const stateB64 = base64url.fromString(JSON.stringify(state));
    const redirect_uri = `${this.oauth.server}/oauth/callback`;
    const authUrl = AuthRedirect.getUrl(provider, redirect_uri, stateB64);
    location.href = authUrl.toString();
  }
}

const codeChallenge = {
  key: 'code_verifier',
  create: async () => {
    const verifier = crypto.getRandomValues(new Uint8Array(64));
    const verifier_base64 = base64url.fromBuffer(verifier);

    const method = 'S256';
    const challenge = await crypto.subtle.digest('SHA-256', verifier)
      .then(buff => base64url.fromBuffer(buff));

    sessionStorage.setItem(codeChallenge.key, verifier_base64);
    return { method, challenge };
  },
  get: () => {
    const verifier = sessionStorage.getItem(codeChallenge.key);
    if (!verifier)
      throw new Error(`'${codeChallenge.key}' not found in sessionStorage`);
    return verifier;
  }
} as const;
