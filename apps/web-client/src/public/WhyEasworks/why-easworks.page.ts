import { Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'Whyeasworks',
  templateUrl: './why-easworks.page.html',
  styleUrls: [],
  imports: [
      LottiePlayerDirective,
      MatTabsModule
  ]
})
export class WhyeasworksComponent {
}
