import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { EmailSignInInput } from 'models/validators/auth';
import { from, switchMap } from 'rxjs';
import { AuthApi } from '../api/auth.api';
import { UsersApi } from '../api/users.api';
import { CLIENT_CONFIG } from '../dependency-injection';
import { authActions, getAuthUserFromModel } from '../state/auth';
import { AuthStorageService } from './auth.storage';
import { CookieService } from './auth.cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly clientConfig = inject(CLIENT_CONFIG);
  private readonly cookies = inject(CookieService);
  private readonly storage = inject(AuthStorageService);

  private readonly api = {
    auth: inject(AuthApi),
    users: inject(UsersApi)
  } as const;

  private readonly sso = this.clientConfig.sso;
  private readonly oauth = this.clientConfig.oauth;

  public readonly signin = {
    email: (input: EmailSignInInput, returnUrl?: string) => {
      return this.api.auth.signin.email(input)
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
              needsOnboarding: false,
              returnUrl: returnUrl || null
            }
          }));
        }),
      );
  }
}