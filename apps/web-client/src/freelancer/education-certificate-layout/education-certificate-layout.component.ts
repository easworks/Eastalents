import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-education-certificate-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education-certificate-layout.component.html',
  styleUrl: './education-certificate-layout.component.css'
})
export class EducationCertificateLayoutComponent {
  items = [1, 2, 3, 4];

  @Output() openeducationPopup = new EventEmitter<void>();
  @Output() openCertificatePopup = new EventEmitter<void>();

  // Method to open the skill popup
  showEducationPopup() {
    this.openeducationPopup.emit();
  }
  showCertificatePopup() {
    this.openCertificatePopup.emit();
  }
}
