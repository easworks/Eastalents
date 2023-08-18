import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { RoleLinkListContainerComponent } from '../common/role-link-list-container.component';
import { RoleSoftwareTalentComponent } from '../common/role-software-talent.component';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';

@Component({
  standalone: true,
  selector: 'software-page',
  templateUrl: './software.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    RoleLinkListContainerComponent,
    RoleSoftwareTalentComponent,
    DomainSoftwareSelectorComponent
  ]
})
export class SoftwarePageComponent {

}
