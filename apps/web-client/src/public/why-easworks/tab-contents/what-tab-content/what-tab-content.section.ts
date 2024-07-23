import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ServiceTypeGetTopEnterpriseSectionComponent } from '../../common/get-top-enterprise/get-top-enterprise.section';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'service-type-what-tab-content-section',
  templateUrl: './what-tab-content.section.html',
  styleUrl: '../../why-easworks.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTab,
    MatTabGroup,
    ServiceTypeGetTopEnterpriseSectionComponent
  ]
})
export class ServiceTypeWhatTabContentSectionComponent {

}