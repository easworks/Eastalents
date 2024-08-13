import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatchFn, MaybeAsync, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { lastValueFrom, Observable } from 'rxjs';
import { authFeature } from '../state/auth';
import { AUTH_READY } from './auth.ready';

export const AUTH_GUARD_SIGN_IN_ACTION = new InjectionToken<() => MaybeAsync<unknown>>('', {
  providedIn: 'root',
  factory: () => {
    console.error('auth guard sign in action not implemented');
    return () => { };
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
          return 'Unauthorized';
        }
      }
      else
        return 'Authorized';
    }
    else {
      return 'Does Not Exist';
    }
  }

  private async processResult(result: AuthGuardResult) {
    switch (result) {
      case 'Does Not Exist':
        let action = this.signInAction();
        if (action instanceof Observable)
          action = lastValueFrom(action);
        await action;
        return false;
      case 'Authorized': return true;
      case 'Unauthorized': return false;
    }
  }
}

export const AuthGuardFn: CanMatchFn = (route) => {
  const auth = inject(AuthGuard);
  return auth.canMatch(route);
};
