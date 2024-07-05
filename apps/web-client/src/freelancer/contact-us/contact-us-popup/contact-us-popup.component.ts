import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-us-popup.component.html',
  styleUrl: './contact-us-popup.component.less',
})
export class ContactUsPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }


}
