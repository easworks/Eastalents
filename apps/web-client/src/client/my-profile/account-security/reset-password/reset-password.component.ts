import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reset-password-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  @Output() closePopup = new EventEmitter<void>();

  onClosePopup() {
    this.closePopup.emit();
  }
}
