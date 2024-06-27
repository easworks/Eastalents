import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsPopupComponent } from './contact-us-popup/contact-us-popup.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ContactUsPopupComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.less',
})
export class ContactUsComponent {
  isContactPopupVisible: boolean = false;

  toggleContactsPopup() {
    this.isContactPopupVisible = !this.isContactPopupVisible;
  }
}
