import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AuthState } from '@easworks/app-shell/state/auth';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';

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

  private readonly state = inject(AuthState);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ui = inject(UI_FEATURE);
  protected readonly signInButtonClass$ = computed(() => {
    return this.ui.selectors.topBar$().dark ?
      'hover:bg-white/90 focus:bg-white/90' :
      '';
  });

  protected readonly icons = {
    faCircleUser
  };

  protected readonly profileLink$ = computed(() => {
    switch (this.state.user$()?.role) {
      case 'freelancer': return '/freelancer/profile';
      case 'employer': return '/employer/profile';
      default: throw new Error('not implmeneted');
    }
  });

  protected readonly user$ = this.state.user$;

  protected signOut() {
    this.auth.signOut();
  }
}