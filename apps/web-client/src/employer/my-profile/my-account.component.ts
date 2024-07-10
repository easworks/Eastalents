import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { AccountEditPopupComponent } from './account-edit-popup/account-edit-popup.component';
import { AccountSecurityComponent } from './account-security/account-security.component';
import { ManageCollabratorComponent } from './manage-collabrator/manage-collabrator.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, AccountSecurityComponent, ManageCollabratorComponent, AccountEditPopupComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyAccountComponent {
  @HostBinding() private readonly class = "page";
  protected readonly activeTab$ = signal<Tab>('manage-collab');
  protected readonly isEditPopupVisible$ = signal(false);
}

type Tab = 'manage-collab' | 'security';
