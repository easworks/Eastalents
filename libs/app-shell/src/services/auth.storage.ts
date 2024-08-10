import { inject, Injectable } from '@angular/core';
import { clear, get, set } from 'idb-keyval';
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

  readonly expiry = {
    key: 'expiry',
    set: async (seconds: number) => {
      const expiry = DateTime.fromSeconds(seconds);
      const expired = expiry.diffNow().milliseconds < 0;
      if (expired)
        throw new CannotSetExpiredValue();
      await set(this.expiry.key, expiry.toISO(), this.cache);
    },
    get: async () => {
      const stored = await get<string>(this.expiry.key, this.cache);
      if (!stored)
        return null;

      const value = DateTime.fromISO(stored);

      if (!value.isValid)
        return null;

      return value;
    },
    isExpired: async () => {
      const expiry = await this.expiry.get();
      return !expiry || expiry.diffNow().milliseconds < 0;
    }
  } as const;

  readonly token = {
    key: 'token',
    set: async (token: string) => {
      if (!this.cache)
        return;
      const payload = this.getPayload(token);
      const exp = payload.exp;
      if (!exp)
        throw new Error('invalid token');

      await this.expiry.set(exp);
      await set(this.token.key, token, this.cache);
    },
    get: async () => {
      if (!this.cache || await this.expiry.isExpired())
        return null;

      return await get<string>(this.token.key, this.cache) || null;
    }
  } as const;

  readonly user = {
    key: 'user',
    set: async (user: AuthUser) => {
      return set(this.user.key, user, this.cache);
    },
    get: async () => {
      if (!this.cache || await this.expiry.isExpired())
        return null;

      return await get<AuthUser>(this.user.key, this.cache) || null;
    }
  } as const;

  async clear() {
    await clear(this.cache);
  }

  private getPayload(token: string) {
    const base64 = token.split('.')[1];
    const plain = atob(base64);
    return JSON.parse(plain) as JwtPayload;
  }
}

export class AuthStorageLockSet extends Error { }

export class CannotSetExpiredValue extends Error { }
