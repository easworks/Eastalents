import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatchFn, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { authFeature } from '../state/auth';
import { AUTH_READY } from './auth.ready';

export const AUTH_GUARD_SIGN_IN_ACTION = new InjectionToken<() => void>('', {
  providedIn: 'root',
  factory: () => {
    return () => console.error('auth guard sign in action not implemented');
  }
});

type AuthGuardResult = 'Does Not Exist' | 'Authorized' | 'Unauthorized';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly ready = inject(AUTH_READY);
  private readonly store = inject(Store);
  private readonly signInAction = inject(AUTH_GUARD_SIGN_IN_ACTION);


  private readonly user$ = this.store.selectSignal(authFeature.selectUser);

  async canMatch(route: Route) {
    const result = await this.check(route);
    return this.processResult(result);
  }

  private async check(route: Route | ActivatedRouteSnapshot) {
    await this.ready;
    const user = this.user$();

    if (user) {
      const authCheck = route.data?.['auth'];
      if (authCheck) {
        const isAuthorized = authCheck(user);
        if (isAuthorized === true)
          return 'Authorized';
        else {
          const message = typeof isAuthorized === 'string' ? isAuthorized : 'Not Authorized';
          this.handleFailure(message);
          return 'Unauthorized';
        }
      }
      else
        return 'Authorized';
    }
    else {
      this.handleFailure('Please sign in');
      return 'Does Not Exist';
    }
  }

  private async processResult(result: AuthGuardResult) {
    switch (result) {
      case 'Does Not Exist':
        this.signInAction();
        return new Promise<never>(() => undefined);
      case 'Authorized': return true;
      case 'Unauthorized': return false;
    }
  }

  private handleFailure(message: string) {
    console.error('auth check failed', message);
  }
}

export const AuthGuardFn: CanMatchFn = (route) => {
  const auth = inject(AuthGuard);
  return auth.canMatch(route);
};
