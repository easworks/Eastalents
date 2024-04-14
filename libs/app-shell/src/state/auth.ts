import { Injectable, computed, effect, isDevMode, signal } from '@angular/core';
import { SocialUserNotInDB, UserWithToken } from '@easworks/models';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  constructor() {
    if (isDevMode()) {
      effect(() => {
        console.debug(this.user$());
      });
    }
  }

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