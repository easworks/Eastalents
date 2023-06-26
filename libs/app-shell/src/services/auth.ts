import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, Route, Router, UrlSegment } from '@angular/router';
import { EmailSignInRequest, EmailSignUpRequest, RETURN_URL_KEY, Role, SocialCallbackState, SocialIdp, SocialSignInRequest, SocialSignUpRequest, User, UserWithToken } from '@easworks/models';
import { Subject, catchError, fromEvent, map } from 'rxjs';
import { AccountApi } from '../api/account.api';
import { ErrorSnackbarDefaults, SnackbarComponent, SuccessSnackbarDefaults } from '../notification/snackbar';
import { AuthState } from '../state/auth';
import { Deferred } from '../utilities/deferred';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    this.reactToLocalStorage();
  }

  private readonly dRef = inject(DestroyRef);
  private readonly state = inject(AuthState);
  private readonly api = {
    account: inject(AccountApi)
  } as const;
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly ready = new Deferred();
  get token() {
    return this.ready
      .then(() => this.state.user$()?.token || null);
  }

  readonly afterSignIn$ = new Subject<SignInMeta>();

  readonly socialCallback = {
    set: (state: SocialCallbackState) => {
      state.challenge = [...crypto.getRandomValues(new Uint8Array(16))]
        .map(i => i.toString(16))
        .join('');

      localStorage.setItem(`socialCallback`, JSON.stringify(state));

      return state.challenge;
    },
    get: () => {
      const saved = localStorage.getItem(`socialCallback`)
      if (saved) {
        localStorage.removeItem(`socialCallback`);
        return JSON.parse(saved) as SocialCallbackState;
      }
      else
        return null;
    },
    getToken: (input: SocialSignInRequest | SocialSignUpRequest, meta: SignInMeta) =>
      this.api.account.socialLogin(input)
        .pipe(map(r => {
          if ('token' in r) {
            this.handleSignIn(r, meta)
          }
          return r;
        }))
  };

  readonly signup = {
    social: (provider: SocialIdp, role: Role) => {
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
    email: (input: EmailSignUpRequest) =>
      this.api.account.signup(input)
        .pipe(
          map(r => {
            this.handleSignIn(r, { isNewUser: true });
            return r;
          }),
          catchError((e) => {
            this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
            throw e;
          })
        )
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
        .pipe(
          map(r => {
            this.handleSignIn(r, { isNewUser: false, returnUrl });
            return r;
          }),
          catchError((e) => {
            this.snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
            throw e;
          })
        )
  } as const;

  signOut() {
    this.state.user$.set(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  handleSignIn(user: UserWithToken, meta: SignInMeta) {
    this.state.user$.set(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.afterSignIn$.next(meta);
    this.snackbar.openFromComponent(SnackbarComponent, {
      ...SuccessSnackbarDefaults,
      data: {
        message: 'Sign In Successful!'
      }
    });
  }

  private async reactToLocalStorage() {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      const cu = JSON.parse(storedUser) as UserWithToken;
      this.state.user$.set(cu);
    }
    this.ready.resolve();

    fromEvent<StorageEvent>(window, 'storage')
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe(ev => {
        if (ev.key === CURRENT_USER_KEY) {
          location.reload();
        }
      });
  }
}

type AuthGuardResult = 'Does Not Exist' | 'Authorized' | 'Unauthorized';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly auth = inject(AuthService);
  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);

  static async asFunction(route: Route, segments: UrlSegment[]) {
    const auth = inject(AuthGuard);
    return auth.canMatch(route, segments);
  }

  async canMatch(route: Route, segments: UrlSegment[]) {
    const result = await this.check(route);
    return this.processResult(result, '/' + segments.map(s => s.path).join('/'));
  }

  private async check(route: Route | ActivatedRouteSnapshot) {
    await this.auth.ready;
    const user = this.authState.user$();

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

export const AUTH_GUARD_CHECKS = {
  isInRole: (role: Role) => (user: User) => user.role === role
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
  isNewUser: boolean;
  [RETURN_URL_KEY]?: string;
}
