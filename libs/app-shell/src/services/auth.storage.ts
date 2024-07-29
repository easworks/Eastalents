import { inject, Injectable } from '@angular/core';
import { get, set } from 'idb-keyval';
import type { JwtPayload } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { CACHE } from '../common/cache';
import { AuthUser } from '../state/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private readonly cache = inject(CACHE)?.auth;


  readonly lock = {
    key: 'auth_lock',
    has: () => !!localStorage.getItem(this.lock.key),
    set: () => {
      if (this.lock.has())
        throw new AuthStorageLockSet();

      localStorage.setItem(this.lock.key, DateTime.now().toISO());
    },
    remove: () => localStorage.removeItem(this.lock.key)
  } as const;

  readonly token = {
    set: async (token: string) => {
      if (!this.cache)
        return;
      const payload = this.getPayload(token);
      const exp = payload.exp;
      if (!exp)
        throw new Error('invalid token');

      const expiry = DateTime.fromSeconds(exp);
      const expired = expiry.diffNow().milliseconds < 0;
      if (expired)
        throw new CannotSetExpiredToken();

      await set('token', token, this.cache);
      await set('expiry', DateTime.fromSeconds(exp).toISO(), this.cache);
    },
    get: async () => {
      if (!this.cache)
        return null;

      const exp = await get<string>('expiry', this.cache);
      if (!exp)
        return null;

      const expiry = DateTime.fromISO(exp);
      const expired = expiry.diffNow().milliseconds < 0;
      if (expired)
        return null;

      return await get<string>('token', this.cache);
    }
  } as const;

  readonly user = {
    key: 'user',
    set: async (user: AuthUser) => {
      return set(this.user.key, user, this.cache);
    },
    get: async () => {
      return get<AuthUser>(this.user.key, this.cache);
    }
  } as const;

  private getPayload(token: string) {
    const base64 = token.split('.')[1];
    const plain = atob(base64);
    return JSON.parse(plain) as JwtPayload;
  }
}

export class AuthStorageLockSet extends Error { }

export class CannotSetExpiredToken extends Error { }
