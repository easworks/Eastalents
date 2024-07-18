import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServiceTypeHiringStepsSectionComponent } from '../common/hiring-steps/hiring-steps.section';
import { ServiceTypeWhyChooseEasworksSectionComponent } from '../common/why-choose-easworks/why-choose-easworks.section';

@Component({
  standalone: true,
  selector: 'service-type-hire-contractors-page',
  templateUrl: './hire-contractors.page.html',
  styleUrl: './hire-contractors.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ServiceTypeHiringStepsSectionComponent,
    ServiceTypeWhyChooseEasworksSectionComponent
  ]
})
export class HireContractorsPageComponent {

}