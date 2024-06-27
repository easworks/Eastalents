import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSecurityComponent } from './account-security/account-security.component';
import { AccountEditPopupComponent } from './account-edit-popup/account-edit-popup.component';


@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, AccountSecurityComponent, AccountEditPopupComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.less',
})
export class MyAccountComponent {
  activeTab: string = 'myaccount';
  isEditPopupVisible: boolean = false;

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }

  setIsEditPopupVisible(value: boolean) {
    this.isEditPopupVisible = value;
  }
}
