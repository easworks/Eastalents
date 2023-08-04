import { Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'EasworksTalent',
  templateUrl: './EasworksTalent.page.html',
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
  ]
})
export class EasworksTalentComponent {
}
