import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'privacy-page',
  templateUrl: './privacy.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
  ]
})
export class PrivacyPageComponent {
}
