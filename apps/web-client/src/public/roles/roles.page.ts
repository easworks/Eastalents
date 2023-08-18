import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { RoleSoftwareTalentComponent } from '../common/role-software-talent.component';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';

@Component({
  standalone: true,
  selector: 'roles-page',
  templateUrl: './roles.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    RoleSoftwareTalentComponent,
    DomainSoftwareSelectorComponent
  ]
})
export class RolesPageComponent {
  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);
}
