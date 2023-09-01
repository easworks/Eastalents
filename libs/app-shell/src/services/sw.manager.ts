import { Injectable, InjectionToken, inject, isDevMode, signal } from '@angular/core';
import { Workbox, messageSW } from 'workbox-window';
import { Deferred } from '../utilities/deferred';

export const SW_URL = new InjectionToken<string>('SW_URL: The service worker url');

@Injectable({
  providedIn: 'root'
})
export class SWManagementService {
  constructor() {
    this.wb = new Workbox(this.swUrl);
    this.checkInterval = this.devMode ? 1000 : 7 * 60 * 60 * 1000;

    this.ready = new Deferred();

    this.wb.addEventListener('waiting', event => {

      if (!event.sw)
        throw new Error('waiting service worker not in event');

      if (this.devMode) {
        messageSW(event.sw, { type: 'SKIP_WAITING' });
      }
      else {
        this.wb.addEventListener('controlling', () => {
          window.location.reload();
        });


        if (event.wasWaitingBeforeRegister) {
          this.updating$.set(true);
          messageSW(event.sw, { type: 'SKIP_WAITING' });
        }
        else {
          this.updateAvailable$.set(true);
          alert('Site update available! Please refresh for the latest features and bug fixes.');
        }
      }
    });

    this.wb.addEventListener('activated', event => {
      if (!event.sw)
        throw new Error('activated service worker not in event');

      messageSW(event.sw, { type: 'CLAIM_CLIENTS' });
    });

    this.wb.addEventListener('controlling', async () => {
      this.ready.resolve();
    });

    navigator.serviceWorker.getRegistration()
      .then(async reg => {
        const active = reg?.active;
        if (!active)
          return;

        if (!navigator.serviceWorker.controller) {
          await messageSW(active, { type: 'CLAIM_CLIENTS' });
        }
      })
      .then(() => this.wb.register())
      .then(() => this.wb.active)
      .then(() => this.wb.messageSW({ type: 'CLAIM_CLIENTS' }))
      .then(() => this.wb.update())
      .then(() => navigator.serviceWorker.getRegistration())
      .then(reg => {
        if (!reg?.installing)
          this.ready.resolve();
      });
  }

  private readonly swUrl = inject(SW_URL);
  private readonly devMode = isDevMode();

  readonly wb: Workbox;
  private readonly checkInterval: number;
  readonly updateAvailable$ = signal(false);
  readonly updating$ = signal(false);
  readonly ready;
}