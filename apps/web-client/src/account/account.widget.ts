import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { AuthService, AuthState } from '@easworks/app-shell';
import { Router } from '@angular/router';

@Component({
  selector: 'account-widget',
  templateUrl: './account.widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatRippleModule
  ]
})
export class AccountWidgetComponent {

  private readonly state = inject(AuthState);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user$ = this.state.user$;

  protected signIn() {
    this.router.navigateByUrl('/account/sign-in');
  }

  protected signOut() {
    this.auth.signOut();
  }
}