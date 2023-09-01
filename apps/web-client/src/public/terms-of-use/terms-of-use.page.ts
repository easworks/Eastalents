import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'terms-of-use-page',
  templateUrl: './terms-of-use.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
  ]
})
export class TermsOfUsePageComponent {
}
