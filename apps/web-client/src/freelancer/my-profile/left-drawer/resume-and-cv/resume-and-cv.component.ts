import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faClose, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resume-and-cv',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './resume-and-cv.component.html',
})
export class ResumeAndCVComponent {
  @Input() showPopup:boolean = false 
  closeIcon: IconDefinition = faClose;
  deleteIcon: IconDefinition = faDeleteLeft;
  onClosePopup() {
    this.showPopup = false;  
  }


}
