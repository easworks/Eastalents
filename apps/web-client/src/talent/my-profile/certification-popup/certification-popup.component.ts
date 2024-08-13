import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certification-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certification-popup.component.html',
  styleUrl: './certification-popup.component.less',
})
export class CertificationPopupComponent {

  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }
}
