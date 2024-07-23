import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ServiceTypeWhyTabContentSectionComponent } from './tab-contents/why-tab-content/why-tab-content.section';
import { ServiceTypeGetTopEnterpriseSectionComponent } from './common/get-top-enterprise/get-top-enterprise.section';
import { ServiceTypeHowTabContentSectionComponent } from './tab-contents/how-tab-content/how-tab-content.section';
import { ServiceTypeWhatTabContentSectionComponent } from './tab-contents/what-tab-content/what-tab-content.section';

@Component({
  standalone: true,
  selector: 'why-easworks-page',
  templateUrl: './why-easworks.page.html',
  styleUrls: ['./why-easworks.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTabsModule,
    ServiceTypeWhyTabContentSectionComponent,
    ServiceTypeGetTopEnterpriseSectionComponent,
    ServiceTypeHowTabContentSectionComponent,
    ServiceTypeWhatTabContentSectionComponent,
  ],
})
export class WhyEasworksPageComponent {}
