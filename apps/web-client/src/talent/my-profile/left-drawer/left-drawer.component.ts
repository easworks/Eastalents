import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition, faAngleLeft, faAngleRight, faFile, faFilePdf, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ResumeAndCVComponent } from './resume-and-cv/resume-and-cv.component';

@Component({
  selector: 'app-left-drawer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ResumeAndCVComponent],
  templateUrl: './left-drawer.component.html',
})
export class LeftDrawerComponent {
  visibleDrawer: boolean = false;
  showResumeAndCv: boolean = false;
  rightIcon: IconDefinition = faAngleRight;
  leftIcon: IconDefinition = faAngleLeft;
  pdfIcon: IconDefinition = faFilePdf;
  linkIcon: IconDefinition = faLink;
  fileIcon: IconDefinition = faFile;

  onCloseDrawer() {
    this.visibleDrawer = !this.visibleDrawer;
  }

  onResumeAndCV() {
    this.showResumeAndCv = !this.showResumeAndCv;
  }


}
