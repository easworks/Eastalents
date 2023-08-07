import { Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: [],
  imports: [
    LottiePlayerDirective
  ]
})
export class HomePageComponent {

}
