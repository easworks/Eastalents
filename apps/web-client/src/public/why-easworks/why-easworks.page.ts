import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'why-easworks-page',
  templateUrl: './why-easworks.page.html',
  styleUrls: ['./why-easworks.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabsModule],
})
export class WhyEasworksPageComponent {

}
