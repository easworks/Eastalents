import { Injectable, computed, signal } from '@angular/core';
import { SocialUserNotInDB, UserWithToken } from '@easworks/models';
import { Deferred } from '../utilities/deferred';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user$ = signal<UserWithToken | null>(null);
  readonly partialSocialSignIn$ = signal<SocialUserNotInDB | null>(null);
  readonly ready = new Deferred();

  async token() {
    await this.ready;
    return this.user$()?.token || null;
  }

  guaranteedUser() {
    return computed(() => {
      const u = this.user$();
      if (!u)
        throw new Error('invalid opeartion');
      return u;
    });
  }
}