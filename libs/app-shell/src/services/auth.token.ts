import { inject, Injectable } from '@angular/core';
import { get, set } from 'idb-keyval';
import type { JwtPayload } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { CACHE } from '../common/cache';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private readonly cache = inject(CACHE)?.auth;

  async setToken(token: string) {
    if (!this.cache)
      return;
    const payload = this.getPayload(token);
    const exp = payload.exp;
    if (!exp)
      throw new Error('invalid token');

    const expiry = DateTime.fromSeconds(exp);
    const expired = expiry.diffNow().milliseconds < 0;
    if (expired)
      return;

    await set('token', token, this.cache);
    await set('expiry', DateTime.fromSeconds(exp).toISO(), this.cache);
  }

  async getToken() {
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

  private getPayload(token: string) {
    const base64 = token.split('.')[1];
    const plain = atob(base64);
    return JSON.parse(plain) as JwtPayload;
  }
}