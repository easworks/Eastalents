import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { EmailSignInInput } from 'models/validators/auth';
import { from, switchMap, tap } from 'rxjs';
import { AuthApi } from '../api/auth.api';
import { UsersApi } from '../api/users.api';
import { sleep } from '../utilities/sleep';
import { AuthStorageService } from './auth.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly api = {
    auth: inject(AuthApi),
    users: inject(UsersApi)
  } as const;

  private readonly tokenService = inject(AuthStorageService);

  public readonly signin = {
    email: (input: EmailSignInInput, returnUrl?: string) => {
      return this.api.auth.signin.email(input)
        .pipe(
          switchMap(response => this.handleSignIn(response.access_token))
        );
    }
  } as const;

  private handleSignIn(token: string) {
    return from(sleep(3000))
      .pipe(
        switchMap(() => this.tokenService.token.set(token)),
        tap(() => {
          console.debug('completed sign in handling');

        })
      );
  }
}