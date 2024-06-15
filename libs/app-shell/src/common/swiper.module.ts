import { DestroyRef, Directive, ElementRef, HostBinding, Input, NgModule, OnChanges, OnInit, SimpleChanges, inject, numberAttribute } from '@angular/core';
import { Swiper } from 'swiper';
import { SwiperModule, SwiperOptions } from 'swiper/types';

@Directive({
  selector: 'swiper',
})
export class SwiperDirective implements OnInit, OnChanges {
  constructor() {
    const dRef = inject(DestroyRef);
    dRef.onDestroy(() => {
      this.swiper?.destroy();
    });
  }

  @HostBinding() private readonly class = 'swiper';
  private readonly hostElement = inject(ElementRef).nativeElement as HTMLElement;

  private swiper!: Swiper;

  @Input() options: SwiperOptions = {};
  @Input() modules: SwiperModuleId[] = [];

  async ngOnInit() {
    await injectModules(this.options, this.modules);
    this.normalizePagination(this.options);
    this.normalizeNavigation(this.options);
    this.swiper = new Swiper(this.hostElement, this.options);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if ('options' in changes) {
      if (changes['options'].firstChange === false) {
        this.swiper.destroy();
        await injectModules(this.options, this.modules);
        this.swiper = new Swiper(this.hostElement, this.options);
      }
    }
  }

  private normalizeNavigation(opts: SwiperOptions) {
    if (!opts.navigation)
      return;
    if (typeof opts.navigation === 'boolean') {
      opts.navigation = {
        enabled: opts.navigation || false
      };
    }

    opts.navigation.prevEl = '.swiper-button-prev';
    opts.navigation.nextEl = '.swiper-button-next';
  };

  private normalizePagination(opts: SwiperOptions) {
    if (!opts.pagination)
      return;
    if (typeof opts.pagination === 'boolean') {
      opts.pagination = {
        enabled: opts.pagination || false
      };
    }

    opts.pagination.el = '.swiper-pagination';
  }
}

@Directive({
  selector: 'swiper-slide'
})
export class SwiperSlideDirective {
  @HostBinding('attr.data-swiper-slide-index')
  @Input({ required: true, transform: numberAttribute }) index!: number;

  @HostBinding() private readonly class = 'swiper-slide';
}

@NgModule({
  declarations: [
    SwiperDirective,
    SwiperSlideDirective
  ],
  exports: [
    SwiperDirective,
    SwiperSlideDirective
  ],
})
export class NgSwiperModule { }

const allowedModules = [
  'autoplay',
  'navigation',
  'pagination',
  'mousewheel'
] as const;

export type SwiperModuleId = typeof allowedModules[number];

const moduleMap = {
  'autoplay': () => import('swiper/modules').then(m => m.Autoplay),
  'navigation': () => import('swiper/modules').then(m => m.Navigation),
  'pagination': () => import('swiper/modules').then(m => m.Pagination),
  'mousewheel': () => import('swiper/modules').then(m => m.Mousewheel),
} as Record<SwiperModuleId, () => Promise<SwiperModule>>;

function addCoreSwiperStyle() {
  const mainStyleRegex = /styles(-.*)?\.css/;
  const styleLinks = [] as HTMLLinkElement[];
  document.head.querySelectorAll('link').forEach(l => styleLinks.push(l));
  const mainStyleLink = styleLinks.find(l => mainStyleRegex.test(l.href));

  if (!mainStyleLink)
    throw new Error('invalid operation');

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/swiper/swiper.min.css';
  mainStyleLink.insertAdjacentElement('beforebegin', link);

  return link;
}

const coreLink = addCoreSwiperStyle();


async function injectModules(opts: SwiperOptions, modules: SwiperModuleId[]) {
  const styleSheets = modules.map(m => `/assets/swiper/modules/${m}.min.css`);

  const styleLinks = [] as HTMLLinkElement[];
  document.head.querySelectorAll('link').forEach(l => styleLinks.push(l));

  styleSheets.forEach(href => {
    const exists = styleLinks.find(l => l.href === href);
    if (exists)
      return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    coreLink.insertAdjacentElement('afterend', link);
  });

  opts.modules = await Promise.all(modules.map(m => moduleMap[m]()));
}
