import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthState } from '@easworks/app-shell';

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
    RouterModule
  ]
})
export class AccountWidgetComponent {

  private readonly state = inject(AuthState);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user$ = this.state.user$;

  protected signOut() {
    this.auth.signOut();
  }
}