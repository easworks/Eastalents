import { DestroyRef, effect, inject, InjectionToken, isDevMode, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, interval } from 'rxjs';
import { messageSW, Workbox } from 'workbox-window';
import { Deferred } from '../utilities/deferred';
import { isBrowser } from '../utilities/platform-type';

declare const __SW_URL: string | undefined;
export const SW_URL = new InjectionToken<string>('SW_URL: The service worker url', {
  providedIn: 'root',
  factory: () => isBrowser() && __SW_URL || ''
});

export const SW_MANAGER = new InjectionToken(
  'SW_MANAGER: Manages service worker registration and updates',
  {
    providedIn: 'root',
    factory: () => isBrowser() && new SWManagerService(),
  }
);

class SWManagerService {
  constructor() {
    effect(() => {
      const updateAvailable = this.updateAvailable$();
      if (updateAvailable) {
        if (this.devMode) {
          this.wb.messageSkipWaiting();
        }
        this.ready.resolve();
      }
    });

    this.wb.register({ immediate: true })
      .then(async reg => {
        if (reg?.active) {
          const lookForUpdates = () => this.wb.update().catch(() => void 0);

          await lookForUpdates();

          if (this.devMode) {
            interval(250)
              .pipe(
                concatMap(() => lookForUpdates()),
                takeUntilDestroyed(this.dRef))
              .subscribe();
          }
        }
        return reg;
      })
      .then(async reg => {
        if (!reg)
          return;

        if (reg.installing) {
          // 
        }
        else if (reg.waiting) {
          this.updateAvailable$.set(true);
        }
        else if (reg.active) {
          if (navigator.serviceWorker.controller === null) {
            await messageSW(reg.active, { type: 'CLAIM_CLIENTS' });
          }
          else if (reg.active === navigator.serviceWorker.controller) {
            this.ready.resolve();
          }
        }
      });

    this.wb.addEventListener('waiting', async event => {
      // console.debug('waiting', event);

      if (!event.wasWaitingBeforeRegister) {
        this.updateAvailable$.set(true);
      }
    });

    this.wb.addEventListener('activated', async event => {
      // console.debug('activated', event);
      if (!event.sw)
        throw new Error('activated service worker not in event');

      if (!event.isUpdate)
        await messageSW(event.sw, { type: 'CLAIM_CLIENTS' });
    });

    this.wb.addEventListener('controlling', event => {
      // console.debug('controlling', event);
      this.updateAvailable$.set(false);
      this.ready.resolve();
      if (event.isUpdate)
        location.reload();
    });
  }


  private readonly swUrl = inject(SW_URL);
  readonly dRef = inject(DestroyRef);

  private readonly devMode = isDevMode();
  readonly wb = new Workbox(this.swUrl);
  readonly updateAvailable$ = signal(false);
  readonly updating$ = signal(false);
  readonly ready = new Deferred();
}