import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ServiceTypeGetTopEnterpriseSectionComponent } from './common/get-top-enterprise/get-top-enterprise.section';

@Component({
  standalone: true,
  selector: 'why-easworks-page',
  templateUrl: './why-easworks.page.html',
  styleUrls: ['./why-easworks.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabsModule, ServiceTypeGetTopEnterpriseSectionComponent],
})
export class WhyEasworksPageComponent { }
