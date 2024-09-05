import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { isServer } from '@easworks/app-shell/utilities/platform-type';
import { SwiperOptions } from 'swiper/types';
import { moduleMap, SwiperModuleId } from './utils';

@Injectable({
  providedIn: 'platform'
})
export class SwiperStyleInjectorService {
  private readonly document = isServer() ? null : inject(DOCUMENT);

  private readonly coreLink = (() => {
    if (!this.document)
      return null;

    const mainStyleRegex = /styles(-.*)?\.css/;
    const styleLinks = [] as HTMLLinkElement[];

    this.document.head.querySelectorAll('link').forEach(l => styleLinks.push(l));
    const mainStyleLink = styleLinks.find(l => mainStyleRegex.test(l.href));

    if (!mainStyleLink)
      throw new Error('invalid operation');

    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/swiper/swiper.min.css';
    mainStyleLink.insertAdjacentElement('beforebegin', link);

    return link;
  })();

  public async injectModules(opts: SwiperOptions, modules: readonly SwiperModuleId[]) {
    if (!this.document)
      return;

    const styleSheets = modules.map(m => `/assets/swiper/modules/${m}.min.css`);

    const styleLinks = [] as HTMLLinkElement[];
    this.document.head.querySelectorAll('link').forEach(l => styleLinks.push(l));

    styleSheets.forEach(href => {
      const exists = styleLinks.find(l => l.href === href);
      if (exists)
        return;

      const link = this.document!.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      this.coreLink!.insertAdjacentElement('afterend', link);
    });

    opts.modules = await Promise.all(modules.map(m => moduleMap[m]()));
  }
}