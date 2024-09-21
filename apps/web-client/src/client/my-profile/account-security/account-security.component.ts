import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-account-security',
  standalone: true,
  imports: [CommonModule,ResetPasswordComponent],
  templateUrl: './account-security.component.html',
  styleUrl: './account-security.component.less',
})
export class AccountSecurityComponent {

  showPopup:boolean = false;

  setShowPopup() {
    this.showPopup = !this.showPopup;
  }
}
