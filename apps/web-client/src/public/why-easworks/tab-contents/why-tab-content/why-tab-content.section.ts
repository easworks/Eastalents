import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ServiceTypeGetTopEnterpriseSectionComponent } from '../../common/get-top-enterprise/get-top-enterprise.section';

@Component({
  standalone: true,
  selector: 'service-type-why-tab-content-section',
  templateUrl: './why-tab-content.section.html',
  styleUrl: '../../why-easworks.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ServiceTypeGetTopEnterpriseSectionComponent]
})
export class ServiceTypeWhyTabContentSectionComponent {

}