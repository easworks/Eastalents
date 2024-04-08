import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { USE_CASE_DATA, UseCase } from './data';

@Component({
  standalone: true,
  selector: 'use-cases-page',
  templateUrl: './use-cases.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule
  ]
})
export class UseCasesPageComponent {

  constructor() {
    inject(ActivatedRoute).data
      .pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.useCase$.set(d['useCase']);
      });
  }

  protected readonly useCase$ = signal<UseCase>(USE_CASE_DATA['digital-transformation']);


  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);
}
