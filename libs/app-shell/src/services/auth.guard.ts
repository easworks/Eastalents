import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatchFn, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { ALL_ROLES, isPermissionDefined, isPermissionGranted } from 'models/permissions';
import { authFeature, AuthUser } from '../state/auth';
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return new Promise<never>(() => { });
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


export type AuthValidator = (user: AuthUser) => boolean;

const cache = {
  hasPermission: new Map<string, AuthValidator>(),
  hasRole: new Map<string, AuthValidator>(),
} as const;

// TODO: Remove the role check
export const AUTH_GUARD_CHECKS = {
  isInRole: (role: string) => {
    {
      const cached = cache.hasRole.get(role);
      if (cached) return cached;
    }

    const foundRole = ALL_ROLES.get(role);
    if (!foundRole) {
      throw new Error(`role '${role}' is not defined`);
    }

    const validator: AuthValidator = (user) => user.roles.has(role);

    cache.hasRole.set(role, validator);
    return validator;
  },
  hasPermissions: (permission: string) => {
    {
      const cached = cache.hasPermission.get(permission);
      if (cached) return cached;
    }

    // validate the permission string
    if (!isPermissionDefined(permission))
      throw new Error(`a route uses a permission '${permission}' which is not defined`);

    const validator: AuthValidator = (user) => isPermissionGranted(permission, user.permissions);

    cache.hasPermission.set(permission, validator);
    return validator;
  }

} as const;