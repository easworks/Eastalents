import { DestroyRef, effect, inject, Injectable, InjectionToken, INJECTOR, isDevMode, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, interval } from 'rxjs';
import { Deferred } from '../utilities/deferred';
import { isBrowser } from '../utilities/platform-type';

declare const __SW_URL: string | undefined;
export const SW_URL = new InjectionToken<string>('SW_URL: The service worker url', {
  providedIn: 'root',
  factory: () => {
    if (isBrowser()) {
      try {
        return __SW_URL || '';
      }
      catch {
        return '';
      }
    }
    return '';
  }
});


export const WORKBOX_WINDOW = new InjectionToken('WORKBOX_WINDOW', {
  providedIn: 'root',
  factory: () => inject(SW_URL) ? import('workbox-window') : undefined
});


@Injectable({
  providedIn: 'root'
})
export class SWManagerService {
  private readonly workboxWindow = inject(WORKBOX_WINDOW);
  private readonly swUrl = inject(SW_URL);
  private readonly dRef = inject(DestroyRef);
  private readonly injector = inject(INJECTOR);

  private readonly devMode = isDevMode();
  readonly updateAvailable$ = signal(false);
  readonly updating$ = signal(false);
  readonly ready = new Deferred();

  readonly wb = (async () => {
    const ww = await this.workboxWindow;
    if (!ww)
      return undefined;
    return new ww.Workbox(this.swUrl);
  })();

  readonly messageSW = (async () => {
    const ww = await this.workboxWindow;
    return ww?.messageSW;
  })();

  constructor() {
    this.init();
  }

  private async init() {
    const wb = await this.wb;
    const messageSW = await this.messageSW;
    if (!wb || !messageSW)
      return;

    effect(() => {
      const updateAvailable = this.updateAvailable$();
      if (updateAvailable) {
        if (this.devMode) {
          wb.messageSkipWaiting();
        }
        this.ready.resolve();
      }
    }, { injector: this.injector });


    wb.register({ immediate: true })
      .then(async reg => {
        if (reg?.active) {
          const lookForUpdates = () => wb.update().catch(() => void 0);

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

    wb.addEventListener('waiting', async event => {
      // console.debug('waiting', event);

      if (!event.wasWaitingBeforeRegister) {
        this.updateAvailable$.set(true);
      }
    });

    wb.addEventListener('activated', async event => {
      // console.debug('activated', event);
      if (!event.sw)
        throw new Error('activated service worker not in event');

      if (!event.isUpdate)
        await messageSW(event.sw, { type: 'CLAIM_CLIENTS' });
    });

    wb.addEventListener('controlling', event => {
      // console.debug('controlling', event);
      this.updateAvailable$.set(false);
      this.ready.resolve();
      if (event.isUpdate)
        location.reload();
    });
  }

}