import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
@Component({
  standalone: true,
  selector: 'landing-page',
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
      LottiePlayerDirective,
      ImportsModule
  ]
})
export class LandingPageComponent {
    protected readonly customerLogos = [
        'client-1.png',
        'client-2.png',
        'client-3.png',
        'client-4.png',
        'client-5.png',
        'client-1.png',
      ].map(v => `/assets/img/${v}`);
}
