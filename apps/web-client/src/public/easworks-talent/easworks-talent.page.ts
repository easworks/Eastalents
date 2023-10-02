import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { FeaturedDomainsComponent } from '../common/featured-domains.component';

@Component({
  standalone: true,
  selector: 'easworks-talent-page',
  templateUrl: './easworks-talent.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    FeaturedDomainsComponent
  ]
})
export class EasworksTalentPageComponent { }
