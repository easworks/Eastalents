import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education-popup.component.html',
  styleUrl: './education-popup.component.less',
})
export class EducationPopupComponent {

  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }

}
