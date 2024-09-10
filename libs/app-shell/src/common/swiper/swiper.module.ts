import { ChangeDetectionStrategy, Component, DestroyRef, Directive, effect, ElementRef, HostBinding, inject, INJECTOR, Input, input, numberAttribute, OnInit } from '@angular/core';
import { isServer } from 'app-shell/utilities/platform-type';
import { Swiper } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { SwiperStyleInjectorService } from './swiper-style-injector.service';
import { SwiperModuleId } from './utils';

@Directive({
  standalone: true,
  selector: 'swiper',
})
export class SwiperDirective implements OnInit {
  private readonly dRef = inject(DestroyRef);
  private readonly injector = inject(INJECTOR);
  private readonly hostElement = inject(ElementRef).nativeElement as HTMLElement;
  private readonly swiperStyle = inject(SwiperStyleInjectorService);
  private readonly isServer = isServer();

  @HostBinding() private readonly class = 'swiper';

  private swiper?: Swiper;

  public readonly options$ = input<SwiperOptions>({}, { alias: 'options' });
  public readonly modules$ = input<readonly SwiperModuleId[]>([], { alias: 'modules' });

  ngOnInit(): void {
    if (this.isServer)
      return;

    this.dRef.onDestroy(() => this.swiper?.destroy());

    effect(async () => {
      const options = this.options$();
      const modules = this.modules$();

      this.swiper?.destroy();
      await this.swiperStyle.injectModules(options, modules);
      this.swiper = new Swiper(this.hostElement, options);
    }, { injector: this.injector });
  }
}

// TODO: investigate if this is still needed
@Directive({
  selector: 'swiper-slide'
})
export class SwiperSlideDirective {
  @HostBinding('attr.data-swiper-slide-index')
  @Input({ required: true, transform: numberAttribute }) index!: number;

  @HostBinding() private readonly class = 'swiper-slide';
}


export const NgSwiperModule = [
  SwiperDirective
];