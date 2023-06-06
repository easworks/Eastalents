import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@easworks/app-shell';

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
        else if (meta.returnUrl) {
          console.debug('redirect to the redirectUrl')
        }
        else {
          console.debug('redirect to dashboard')
        }
      })
  }

  private readonly auth = inject(AuthService);
}