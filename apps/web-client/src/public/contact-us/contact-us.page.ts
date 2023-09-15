import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'contact-us-page',
  templateUrl: './contact-us.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    MatRippleModule
  ]
})
export class ContactUsPageComponent {
}
