import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-edit-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-edit-popup.component.html',
  styleUrl: './account-edit-popup.component.less',
})
export class AccountEditPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }
}
