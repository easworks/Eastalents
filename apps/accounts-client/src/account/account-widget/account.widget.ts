import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { authFeature } from '@easworks/app-shell/state/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  selector: 'account-widget',
  templateUrl: './account.widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatDividerModule,
    MatRippleModule,
    RouterModule,
    FontAwesomeModule
  ]
})
export class AccountWidgetComponent {

  private readonly store = inject(Store);

  protected readonly user$ = this.store.selectSignal(authFeature.selectUser);

  protected readonly icons = {
    faCircleUser
  };

  protected signOut() {
    // 
  }
}