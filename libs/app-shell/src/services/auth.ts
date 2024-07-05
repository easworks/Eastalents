import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, Route, Router, UrlSegment } from '@angular/router';
import { EmailSignInRequest, EmailSignUpRequest, RETURN_URL_KEY, SocialCallbackState, SocialIdp, SocialSignInRequest, SocialSignUpRequest, SocialUserNotInDB, UserWithToken } from '@easworks/models';
import { Store } from '@ngrx/store';
import { AccountApi } from '../api/account.api';
import { SnackbarComponent, SuccessSnackbarDefaults } from '../notification/snackbar';
import { isPermissionDefined, isPermissionGranted } from '../permissions';
import { authActions, authFeature } from '../state/auth';
import { AUTH_READY } from './auth.ready';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly api = {
    account: inject(AccountApi),
  } as const;
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly socialCallback = {
    partialProfile$: signal<SocialUserNotInDB | null>(null),
    set: (state: SocialCallbackState) => {
      state.challenge = [...crypto.getRandomValues(new Uint8Array(16))]
        .map(i => i.toString(16))
        .join('');

      localStorage.setItem(`socialCallback`, JSON.stringify(state));

      return state.challenge;
    },
    get: () => {
      const saved = localStorage.getItem(`socialCallback`);
      if (saved) {
        localStorage.removeItem(`socialCallback`);
        return JSON.parse(saved) as SocialCallbackState;
      }
      else
        return null;
    },
    getToken: async (input: SocialSignInRequest | SocialSignUpRequest, meta: SignInMeta) =>
      this.api.account.socialLogin(input)
        .then(r => {
          if ('token' in r) {
            this.handleSignIn(r, meta);
          }
          return r;
        })
  } as const;

  readonly signup = {
    social: (provider: SocialIdp, role: string) => {
      const state = this.socialCallback.set({
        request: {
          authType: 'signup',
          userRole: role,
          code: '',
          provider
        },
      });
      const authUrl = AuthRedirect.getUrl(provider, state);
      location.href = authUrl.toString();
    },
    email: async (input: EmailSignUpRequest) => {
      const mailSent = await this.api.account.signup(input)
        .then(r => r.mailSent);

      if (!mailSent)
        throw new Error('verification email was not sent');

      this.snackbar.openFromComponent(SnackbarComponent, SuccessSnackbarDefaults);
      this.router.navigateByUrl('/register/verify-email');
    },
    verifyEmail: async (token: string) => {
      await this.api.account.verifyEmail(token);

      // TODO: depending on result of activation, either directly sign him in or redirect to sign in page

      this.snackbar.openFromComponent(SnackbarComponent, SuccessSnackbarDefaults);

      this.router.navigateByUrl('/account/sign-in');
    }
  } as const;

  readonly signin = {
    social: (provider: SocialIdp, returnUrl?: string) => {
      const state = this.socialCallback.set({
        request: {
          authType: 'signin',
          provider,
          code: ''
        },
        returnUrl
      });
      const authUrl = AuthRedirect.getUrl(provider, state);
      location.href = authUrl.toString();
    },
    email: (input: EmailSignInRequest, returnUrl?: string) =>
      this.api.account.signin(input)
        .then(r => {
          this.handleSignIn(r, { returnUrl });
          return r;
        })
        .catch(e => {
          SnackbarComponent.forError(this.snackbar, e);
        })
  } as const;

  signOut() {
    this.store.dispatch(authActions.updateUser({ payload: { user: null } }));
    localStorage.removeItem(CURRENT_USER_KEY);
    this.store.dispatch(authActions.signOut({ payload: { revoked: false } }));
  }

  private handleSignIn(user: UserWithToken, meta: SignInMeta) {

    this.store.dispatch(authActions.updateUser({ payload: { user } }));

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    this.store.dispatch(authActions.signIn({
      payload: {
        returnUrl: meta[RETURN_URL_KEY]
      }
    }));
  }
}

type AuthGuardResult = 'Does Not Exist' | 'Authorized' | 'Unauthorized';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly ready = inject(AUTH_READY);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  private readonly state$ = this.store.selectSignal(authFeature.selectAuthState);

  static async asFunction(route: Route, segments: UrlSegment[]) {
    const auth = inject(AuthGuard);
    return auth.canMatch(route, segments);
  }

  async canMatch(route: Route, segments: UrlSegment[]) {
    const result = await this.check(route);
    return this.processResult(result, '/' + segments.map(s => s.path).join('/'));
  }

  private async check(route: Route | ActivatedRouteSnapshot) {
    await this.ready;
    const state = this.state$();

    if (state.user) {
      const authCheck = route.data?.['auth'];
      if (authCheck) {
        const isAuthorized = authCheck(state);
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

  private async processResult(result: AuthGuardResult, returnUrl: string) {
    switch (result) {
      case 'Does Not Exist':
        return this.router.navigate(['/account/sign-in'], {
          queryParams: {
            [RETURN_URL_KEY]: returnUrl
          }
        });
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      case 'Authorized': return true;
      case 'Unauthorized': return false;
    }
  }

  private handleFailure(message: string) {
    console.error('auth check failed', message);
  }
}

type AuthState = ReturnType<AuthGuard['state$']> & {
  user: object;
};

// TODO: Remove the role check
export const AUTH_GUARD_CHECKS = {
  isInRole: (role: string) => (state: AuthState) => state.user.role === role,
  hasPermissions: (permissions: string[]) => {
    // validate the permission strings in the menu item
    permissions.forEach(permission => {
      if (!isPermissionDefined(permission))
        throw new Error(`a route uses a permission '${permission}' which is not defined`);
    });

    return (state: AuthState) => permissions.some(p => isPermissionGranted(p, state.permissions));
  }

} as const;


interface AuthRedirectConfig {
  readonly url: string;
  readonly response_type: string;
  readonly redirect_uri: string;
  readonly client_id: string;
  readonly scope?: string;
}

class AuthRedirect {
  private static readonly configs: Readonly<Record<SocialIdp, AuthRedirectConfig>> = {
    google: {
      url: 'https://accounts.google.com/o/oauth2/v2/auth',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '243499270913-h4645hc46b9dqvg6ejaidpch2g6q863r.apps.googleusercontent.com',
      scope: 'email profile'
    },
    linkedin: {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '77xht7uizkpzsm',
      scope: 'r_emailaddress r_liteprofile'
    },
    github: {
      url: 'https://github.com/login/oauth/authorize',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '7ee1b0a43b73c473e120',
      scope: 'email profile'
    }
  };

  static getUrl(provider: SocialIdp, state?: string) {
    const config = this.configs[provider];
    const authUrl = new URL(config.url);
    authUrl.searchParams.set('response_type', config.response_type);
    authUrl.searchParams.set('redirect_uri', config.redirect_uri);
    authUrl.searchParams.set('client_id', config.client_id);
    if (config.scope)
      authUrl.searchParams.set('scope', config.scope);
    if (state)
      authUrl.searchParams.set('state', state);
    return authUrl;
  }
}

const CURRENT_USER_KEY = 'currentUser' as const;

export interface SignInMeta {
  [RETURN_URL_KEY]?: string;
}
