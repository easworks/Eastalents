import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { GENERIC_ROLE_DATA, GenericRole } from './data';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: true,
  selector: 'generic-role-page',
  templateUrl: './generic-role.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule
  ]
})
export class GenericRolePageComponent {
  constructor() {
    inject(ActivatedRoute).data
      .pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.GenericRole$.set(d['GenericRole']);
      });
  }

  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);

  protected readonly GenericRole$ = signal<GenericRole>(GENERIC_ROLE_DATA['enterprise-application-developer']);

}
