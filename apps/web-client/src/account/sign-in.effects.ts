import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@easworks/app-shell/services/auth';
import { AuthState } from '@easworks/app-shell/state/auth';

const noRedirects = [
  '/account/sign-in',
  '/account/register',
  '/account/social'
] as const;

@Injectable({
  providedIn: 'root'
})
export class SignInEffects {
  constructor() {
    this.auth.afterSignIn$.pipe(takeUntilDestroyed())
      .subscribe(meta => {
        if (meta.isNewUser) {
          const role = this.state.user$()?.role;
          if (role === 'freelancer') {
            this.router.navigateByUrl('/freelancer/profile/edit?new');
          }
          else if (role === 'employer') {
            this.router.navigateByUrl('/employer/profile/edit?new');
          }
        }
        else if (meta.returnUrl && noRedirects.every(r => !meta.returnUrl?.startsWith(r))) {
          this.router.navigateByUrl(meta.returnUrl);
        }
        else {
          const role = this.state.user$()?.role;
          if (role === 'freelancer')
            this.router.navigateByUrl('/freelancer');
          else if (role === 'employer')
            this.router.navigateByUrl('/employer');
        }
      });

    this.auth.beforeSignOut$.pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly state = inject(AuthState);
}