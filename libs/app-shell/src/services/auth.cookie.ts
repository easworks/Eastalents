import { computed, Injectable, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { isBrowser } from '../utilities/platform-type';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'platform'
})
export class CookieService {
  constructor() {
    if (isBrowser()) {
      timer(0, 1000)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.read());
    }
  }

  private readonly cookieString = signal('');
  private readonly cookies = computed(() => CookieService.parse(this.cookieString()));

  readonly USER_ID = {
    $: computed(() => this.cookies()['USER_ID'] || null),
    write: (userId: string, expiry: string, domain: string) => {
      document.cookie = `USER_ID=${userId};path=/;domain=${domain};expires=${expiry}`;
    },
    delete: (domain: string) => {
      const expires = DateTime.now().minus({ day: 1 }).toJSDate().toUTCString();
      document.cookie = `USER_ID=;path=/;domain=${domain};expires=${expires}`;
    }
  } as const;

  private static parse(cookieString: string) {
    return cookieString
      .split(';')
      .map(kv => kv.split('='))
      .filter(kv => kv.length === 2)
      .reduce((state, kv) => {
        const key = decodeURIComponent(kv[0].trim());
        const value = decodeURIComponent(kv[1].trim());
        state[key] = value;
        return state;
      }, {} as Record<string, string>);
  }

  read() {
    this.cookieString.set(document.cookie);
  }
}