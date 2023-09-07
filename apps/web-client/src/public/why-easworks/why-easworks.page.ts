import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { UseCaseTilesContainerComponent } from '../common/use-case-tiles-container.component';

@Component({
  standalone: true,
  selector: 'why-easworks-page',
  templateUrl: './why-easworks.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    MatTabsModule,
    UseCaseTilesContainerComponent
  ]
})
export class WhyEasworksPageComponent {
}
