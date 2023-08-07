import { Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'easworks-talent-page',
  templateUrl: './easworks-talent.page.html',
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
  ]
})
export class EasworksTalentPageComponent {
}
