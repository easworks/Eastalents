import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCheck, faAngleRight, faSearch, faFileLines, faVolleyballBall, faSchoolCircleExclamation, faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'company-address',
  templateUrl: './company-address.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule,FontAwesomeModule ]
})
export class CompanyAddressComponent { 
  editIcon:IconDefinition = faEdit
  showEdit:boolean = false
  sameAddress:boolean = false
  
  onShowEdit(){
    this.showEdit = !this.showEdit  
  }

  onSameAddress(){
    this.sameAddress = !this.sameAddress  
  }
}