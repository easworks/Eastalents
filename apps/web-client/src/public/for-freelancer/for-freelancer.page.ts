import { Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  selector: 'for-freelancer-page',
  templateUrl: './for-freelancer.page.html',
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    MatExpansionModule
  ]
})
export class ForFreelancerPageComponent {
  panelOpenState = false;
}
