import { SwiperModule, SwiperOptions } from 'swiper/types';

export const moduleMap = {
  'autoplay': () => import('swiper/modules').then(m => m.Autoplay),
  'navigation': () => import('swiper/modules').then(m => m.Navigation),
  'pagination': () => import('swiper/modules').then(m => m.Pagination),
  'mousewheel': () => import('swiper/modules').then(m => m.Mousewheel),
} as const satisfies Record<string, () => Promise<SwiperModule>>;

export type SwiperModuleId = keyof typeof moduleMap;

function normalizeNavigation(opts: SwiperOptions) {
  if (!opts.navigation)
    return;
  if (typeof opts.navigation === 'boolean') {
    opts.navigation = {
      enabled: opts.navigation || false
    };
  }

  opts.navigation.prevEl = '.swiper-button-prev';
  opts.navigation.nextEl = '.swiper-button-next';
}

function normalizePagination(opts: SwiperOptions) {
  if (!opts.pagination)
    return;
  if (typeof opts.pagination === 'boolean') {
    opts.pagination = {
      enabled: opts.pagination || false
    };
  }

  opts.pagination.el = '.swiper-pagination';
}