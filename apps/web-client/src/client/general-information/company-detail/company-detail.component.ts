import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCheck, faAngleRight, faSearch, faFileLines, faVolleyballBall, faSchoolCircleExclamation, faEdit, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'company-detail',
  templateUrl: './company-detail.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule,FontAwesomeModule ]
})
export class CompanyDetailComponent { 
  editIcon:IconDefinition = faEdit
  showEdit:boolean = false
  
  onShowEdit(){
    this.showEdit = !this.showEdit  
  }
}