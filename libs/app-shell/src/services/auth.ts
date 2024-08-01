import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { EmailSignInInput } from 'models/validators/auth';
import { from, switchMap } from 'rxjs';
import { AuthApi } from '../api/auth.api';
import { OAuthApi } from '../api/oauth.api';
import { UsersApi } from '../api/users.api';
import { CLIENT_CONFIG } from '../dependency-injection';
import { authActions, getAuthUserFromModel } from '../state/auth';
import { base64url } from '../utilities/base64url';
import { CookieService } from './auth.cookie';
import { AuthStorageService } from './auth.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly clientConfig = inject(CLIENT_CONFIG);
  private readonly cookies = inject(CookieService);
  private readonly storage = inject(AuthStorageService);

  private readonly api = {
    oauth: inject(OAuthApi),
    auth: inject(AuthApi),
    users: inject(UsersApi)
  } as const;

  private readonly sso = this.clientConfig.sso;
  private readonly oauth = this.clientConfig.oauth;

  public readonly signIn = {
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
    }
  } as const;

  async signOut() {
    await this.storage.clear();
    if (this.sso)
      this.cookies.USER_ID.delete(this.sso.domain);
    this.store.dispatch(authActions.signOut({ payload: { revoked: false } }));
    this.store.dispatch(authActions.updateUser({ payload: { user: null } }));
  }

  private handleSignIn(token: string, returnUrl?: string) {
    return from(this.storage.token.set(token))
      .pipe(
        switchMap(() => this.api.users.self()),
        switchMap(async self => {
          const user = getAuthUserFromModel(self.user, self.permissionRecord);
          await this.storage.user.set(user);
          if (this.oauth.type === 'host' && this.sso) {
            const expiry = await this.storage.expiry.get();
            if (!expiry)
              throw new Error('expiry should not be null');
            this.cookies.USER_ID.write(user._id, expiry.toISO(), this.sso.domain);
          }
          this.store.dispatch(authActions.updateUser({ payload: { user } }));
          this.store.dispatch(authActions.signIn({
            payload: {
              returnUrl: returnUrl || null
            }
          }));
        }),
      );
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