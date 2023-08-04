import { Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  selector: 'forfreelancer',
  templateUrl: './forfreelancer.page.html',
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    MatExpansionModule
  ]
})
export class ForFreelancerComponent {
  panelOpenState = false;
}
