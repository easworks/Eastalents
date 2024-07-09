import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSecurityComponent } from './account-security/account-security.component';
import { ManageCollabratorComponent } from './manage-collabrator/manage-collabrator.component';
import { AccountEditPopupComponent } from './account-edit-popup/account-edit-popup.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [ CommonModule,AccountSecurityComponent,ManageCollabratorComponent,AccountEditPopupComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  @HostBinding() private readonly class = "page"
  activeTab: string = 'manage-collab';
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
