import { Injectable, computed, signal } from '@angular/core';
import { SocialUserNotInDB, UserWithToken } from '@easworks/models';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user$ = signal<UserWithToken | null>(null);
  readonly partialSocialSignIn$ = signal<SocialUserNotInDB | null>(null);

  guaranteedUser() {
    return computed(() => {
      const u = this.user$();
      if (!u)
        throw new Error('invalid opeartion');
      return u;
    });
  }
}