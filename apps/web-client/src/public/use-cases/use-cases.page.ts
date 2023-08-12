import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'use-cases-page',
  templateUrl: './use-cases.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    LottiePlayerDirective,
    ImportsModule
  ]
})
export class UseCasesPageComponent {
    protected readonly customerLogos = [
        'client-1.png',
        'client-2.png',
        'client-3.png',
        'client-4.png',
        'client-5.png',
        'client-1.png',
      ].map(v => `/assets/img/${v}`);
}
