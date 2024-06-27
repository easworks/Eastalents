import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCheck, faAngleRight, faSearch, faFileLines, faVolleyballBall, faSchoolCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyAddressComponent } from './company-address/company-detail.component';
@Component({
  selector: 'employer-general-info',
  templateUrl: './general-info.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule,CompanyDetailComponent, CompanyAddressComponent]
})
export class EmployerGeneralInfoComponent { 
  activeTab:string = "companyDetails";

  setActiveTab(value:string){
    this.activeTab = value
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
}