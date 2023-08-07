import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { RoleLinkListContainerComponent } from '../common/role-link-list-container.component';

@Component({
  standalone: true,
  selector: 'roles-page',
  templateUrl: './roles.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    RoleLinkListContainerComponent
  ]
})
export class RolesPageComponent {

}
