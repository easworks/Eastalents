import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faGraduationCap, faSackDollar, faBolt, faRotate, faTrophy, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { COMPANY_TYPE_DATA, CompanyType } from './data';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: true,
  selector: 'company-type-page',
  templateUrl: './company-type.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    ImportsModule
  ]
})
export class CompanyTypePageComponent {
  protected readonly icons = {
    faGraduationCap,
    faSackDollar,
    faBolt,
    faRotate,
    faTrophy,
    faAngleRight
  } as const;

  constructor() {
    inject(ActivatedRoute).data
      .pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.CompanyType$.set(d['useCase']);
      });
  }

  protected readonly CompanyType$ = signal<CompanyType>(COMPANY_TYPE_DATA['small-business']);

  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);
}
