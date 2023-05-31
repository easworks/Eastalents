import { Injectable, InjectionToken, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs';
import { SubscribedDirective } from '../utilities';

export interface DefaultSeoConfig {
  /** Site-wide title used to build the page title */
  baseTitle?: string;
  /** Default Page description */
  defaultDescription?: string;
}

export const SEO_DEFAULT_CONFIG = new InjectionToken<DefaultSeoConfig>('SEO_DEFAULT_CONFIG: Site-wide title used to build the page title');

@Injectable({
  providedIn: 'root'
})
export class SEOService extends SubscribedDirective {

  private readonly defaultConfig = inject(SEO_DEFAULT_CONFIG, { optional: true });
  private readonly platformTitle = inject(Title);
  private readonly router = inject(Router);

  constructor() {
    super();

    this.router.events.pipe(
      takeUntil(this.destroyed),
      map(event => {
        if (event instanceof ActivationEnd) {
          const snap = (event as ActivationEnd).snapshot;
          if (snap.component) {
            const config = snap.data?.['seo'] ?
              typeof snap.data['seo'] === 'function' ?
                snap.data['seo'](snap) : snap.data['seo']
              : null;
            this.canonicalUrl = config?.canonical?.(snap) || null;
            this.title = config?.title?.(snap) || null;
            this.description = config?.description?.(snap) || null;
          }
        }
      })
    ).subscribe();
  }

  private _title: string | null = null;

  get title() {
    return this._title;
  }

  set title(newTitle: string | null) {
    this._title = newTitle;
    this.platformTitle.setTitle(this.formatTitle() ?? '');
  }

  private get canonicalLinkTag() {
    return document.head.querySelector('link[rel=canonical]') as HTMLLinkElement;
  }

  set canonicalUrl(value: string) {

    if (value) {
      if (value.startsWith('/')) {
        value = `${location.protocol}//${location.host}${value}`;
      }

      let link = this.canonicalLinkTag;

      if (link) {
        link.href = value;
      }
      else {
        link = document.createElement('link');
        link.rel = 'canonical';
        link.href = value;

        this.descriptionTag.insertAdjacentElement('afterend', link);
      }
    }
    else {
      this.canonicalLinkTag?.remove();
      return;
    }
  }

  private get descriptionTag() {
    const meta = document.head.querySelector<HTMLMetaElement>('meta[name=description]');
    if (meta) {
      return meta;
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const title = document.head.querySelector('title')!;
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = this.defaultConfig?.defaultDescription ?? '';
      title.insertAdjacentElement('afterend', meta);
      return meta;
    }
  }

  set description(newDescription: string) {
    this.descriptionTag.setAttribute('content', newDescription?.length > 0 ? newDescription : (this.defaultConfig?.defaultDescription ?? ''));
  }

  private formatTitle() {
    if (this.title) {
      let t = this.title;
      if (this.defaultConfig?.baseTitle) {
        t = t + ` | ${this.defaultConfig.baseTitle}`;
      }
      return t;
    }
    else
      return this.defaultConfig?.baseTitle ?? null;
  }
}
