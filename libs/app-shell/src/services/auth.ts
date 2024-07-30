import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { EmailSignInInput } from 'models/validators/auth';
import { from, map, switchMap, tap } from 'rxjs';
import { AuthApi } from '../api/auth.api';
import { UsersApi } from '../api/users.api';
import { sleep } from '../utilities/sleep';
import { AuthStorageService } from './auth.storage';
import { authActions, getAuthUserFromModel } from '../state/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly api = {
    auth: inject(AuthApi),
    users: inject(UsersApi)
  } as const;

  private readonly storage = inject(AuthStorageService);

  public readonly signin = {
    email: (input: EmailSignInInput, returnUrl?: string) => {
      return this.api.auth.signin.email(input)
        .pipe(
          switchMap(response => this.handleSignIn(response.access_token, returnUrl))
        );
    }
  } as const;

  private handleSignIn(token: string, returnUrl?: string) {
    return from(this.storage.token.set(token))
      .pipe(
        switchMap(() => this.api.users.self()),
        switchMap(async self => {
          const user = getAuthUserFromModel(self.user, self.permissionRecord);
          await this.storage.user.set(user);
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