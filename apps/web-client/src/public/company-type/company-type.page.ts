import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { NgSwiperModule, SwiperModuleId } from '@easworks/app-shell/common/swiper.module';
import { faAngleLeft, faAngleRight, faBolt, faGraduationCap, faRotate, faSackDollar, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { SwiperOptions } from 'swiper/types';
import { COMPANY_TYPE_DATA, CompanyType } from './data';

@Component({
  standalone: true,
  selector: 'company-type-page',
  templateUrl: './company-type.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    NgSwiperModule
  ]
})
export class CompanyTypePageComponent {
  constructor() {
    inject(ActivatedRoute).data
      .pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.CompanyType$.set(d['CompanyType']);
      });
  }

  protected readonly icons = {
    faGraduationCap,
    faSackDollar,
    faBolt,
    faRotate,
    faTrophy,
    faAngleRight,
    faAngleLeft
  } as const;

  protected readonly CompanyType$ = signal<CompanyType>(COMPANY_TYPE_DATA['small-business']);

  protected readonly swiperOptions = swiperOptions;

  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);
}

const swiperOptions = {
  hero: {
    modules: ['autoplay', 'navigation'] as SwiperModuleId[],
    config: {
      autoplay: true,
      navigation: true
    } as SwiperOptions
  }
} as const;
