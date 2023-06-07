import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@easworks/app-shell';

const noRedirects = [
  '/account/sign-in',
  '/account/sign-up',
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
          console.debug('redirect to profile questions as per the role, with redirectUrl in the queryParams if it exists');
        }
        else if (meta.returnUrl && noRedirects.every(r => !meta.returnUrl?.startsWith(r))) {
          this.router.navigateByUrl(meta.returnUrl);
        }
        else {
          console.debug('redirect to dashboard')
        }
      })
  }

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
}