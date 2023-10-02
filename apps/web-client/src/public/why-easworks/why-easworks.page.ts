import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { UseCaseTilesContainerComponent } from '../common/use-case-tiles-container.component';
import { MatRippleModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'why-easworks-page',
  templateUrl: './why-easworks.page.html',
  styleUrls: ['./why-easworks.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    MatTabsModule,
    UseCaseTilesContainerComponent,
    FontAwesomeModule,
    MatRippleModule
  ]
})
export class WhyEasworksPageComponent {
  protected readonly icons = {
    faXmarkCircle,
    faCheckCircle
  } as const;
}
