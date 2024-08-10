import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServiceTypeHiringStepsSectionComponent } from '../common/hiring-steps/hiring-steps.section';
import { ServiceTypeWhyChooseEasworksSectionComponent } from '../common/why-choose-easworks/why-choose-easworks.section';
import { ServiceTypeHeroSectionComponent } from '../common/hero/hero.section';
import { ServiceTypeAchievementSectionComponent } from '../common/achievement/achievement.section';
import { ServiceTypeHandPickingSectionComponent } from '../common/hand-picking/hand-picking.section';
import { ServiceTypeBenefitHiringContractorsSectionComponent } from '../common/benefit-hiring-contractors/benefit-hiring-contractors.section';
import { ServiceTypeBuildEnterpriseAppSectionComponent } from '../common/build-enterprise-app/build-enterprise-app.section';
import { ServiceTypeDiscoverEliteEnterpriseSectionComponent } from '../common/discover-elite-enterprise/discover-elite-enterprise.section';
import { ServiceTypeErpOperationsSectionComponent } from '../common/erp-operations/erp-operations.section';
import { ServiceTypeJoinCommunitySectionComponent } from '../common/join-community/join-community.section';
import { ServiceTypeIndustriesUseCasesSectionComponent } from '../common/industries-use-cases/industries-use-cases.section';
import { ServiceTypeTestimonialSectionComponent } from '../common/testimonial/testimonial.section';
import { ServiceTypeScheduleCallSectionComponent } from '../common/schedule-call/schedule-call.section';
import { CommonFAQComponent } from '../../common/faq/faq-lists.component';

@Component({
  standalone: true,
  selector: 'service-type-hire-contractors-page',
  templateUrl: './hire-contractors.page.html',
  styleUrl: './hire-contractors.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ServiceTypeHiringStepsSectionComponent,
    ServiceTypeWhyChooseEasworksSectionComponent,
    ServiceTypeHeroSectionComponent,
    ServiceTypeAchievementSectionComponent,
    ServiceTypeHandPickingSectionComponent,
    ServiceTypeBenefitHiringContractorsSectionComponent,
    ServiceTypeBuildEnterpriseAppSectionComponent,
    ServiceTypeDiscoverEliteEnterpriseSectionComponent,
    ServiceTypeErpOperationsSectionComponent,
    ServiceTypeJoinCommunitySectionComponent,
    ServiceTypeIndustriesUseCasesSectionComponent,
    ServiceTypeTestimonialSectionComponent,
    ServiceTypeScheduleCallSectionComponent,
    CommonFAQComponent

  ]
})
export class HireContractorsPageComponent {

}