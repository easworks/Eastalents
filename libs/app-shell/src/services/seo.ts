import { Injectable, InjectionToken, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';
import { map } from 'rxjs';

export interface DefaultSeoConfig {
  /** Site-wide title used to build the page title */
  baseTitle?: string;
  /** Default Page description */
  defaultDescription?: string;
}

export interface PageMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

export const SEO_DEFAULT_CONFIG = new InjectionToken<DefaultSeoConfig>('SEO_DEFAULT_CONFIG: Site-wide title used to build the page title');

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  private readonly defaultConfig = inject(SEO_DEFAULT_CONFIG, { optional: true });
  private readonly platformTitle = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  private readonly title$ = signal(null as string | null);
  private readonly description$ = signal(null as string | null);

  constructor() {
    this.updateTitleOnChange();
    this.updateDescriptionOnChange();

    this.listenToRouterEvents();
  }

  private updateTitleOnChange() {
    effect(() => {
      let title = this.title$();
      if (title) {
        if (this.defaultConfig?.baseTitle) {
          title = title + ` | ${this.defaultConfig.baseTitle}`;
        }
      }
      else
        title = this.defaultConfig?.baseTitle ?? null;

      this.platformTitle.setTitle(title || '');
    });
  }

  private updateDescriptionOnChange() {
    effect(() => {
      let description = this.description$();
      if (!description)
        description = this.defaultConfig?.defaultDescription || '';
      this.meta.updateTag({
        name: 'description',
        content: description,
      });
    });
  }

  private listenToRouterEvents() {
    this.router.events.pipe(
      map(event => {
        if (event instanceof ActivationEnd) {
          const snap = (event as ActivationEnd).snapshot;
          const config = getSeoConfig(snap);
          this.title$.set(config?.title || null);
          this.description$.set(config?.description || null);
        }
      }),
      takeUntilDestroyed(),
    ).subscribe();
  }
}

function getSeoConfig(snap: ActivatedRouteSnapshot) {
  if (snap.component) {
    if ('meta' in snap.data) {
      let config = snap.data['meta'];
      if (typeof config === 'function') {
        config = config(snap);
      }
      return config as PageMetadata;
    }
  }

  return null;
}
