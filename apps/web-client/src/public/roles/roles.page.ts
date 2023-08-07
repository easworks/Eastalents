import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'roles-page',
  templateUrl: './roles.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective
  ]
})
export class RolesPageComponent {

}
