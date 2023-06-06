import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailAuthRequest, GoogleCallbackState, RETURN_URL_KEY, SocialIdp, UserWithToken } from '@easworks/models';
import { Subject, firstValueFrom, fromEvent } from 'rxjs';
import { AccountApi } from '../api';
import { ErrorSnackbarDefaults, SnackbarComponent, SuccessSnackbarDefaults } from '../notification';
import { AuthState } from '../state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Deferred } from '../utilities';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    this.reactToLocalStorage();
  }

  private readonly state = inject(AuthState);
  private readonly api = {
    account: inject(AccountApi)
  } as const;
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  readonly ready = new Deferred();

  readonly afterSignIn$ = new Subject<SignInMeta>();

  readonly signin = {
    github: () => {
      console.debug('[SIGN IN] Github');
    },
    linkedIn: () => {
      console.debug('[SIGN IN] LinkedIn');
    },
    google: (returnUrl?: string) => {
      console.debug('[SIGN IN] Google');
      const authUrl = AuthRedirect.getUrl('google');
      const state = JSON.stringify({
        provider: 'google',
        returnUrl
      } satisfies GoogleCallbackState);
      authUrl.searchParams.set('state', state);

      console.debug(authUrl.href);
    },
    email: (input: EmailAuthRequest, meta: SignInMeta) =>
      firstValueFrom(this.api.account.signIn.email(input))
        .then(r => {
          this.handleSignIn(r, meta);
        })
        .catch(e => {
          this.snackbar.openFromComponent(SnackbarComponent, {
            ...ErrorSnackbarDefaults
          });
          throw e;
        })
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

  private reactToLocalStorage() {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      const cu = JSON.parse(storedUser) as UserWithToken;
      this.state.user$.set(cu);
    }
    this.ready.resolve();

    fromEvent<StorageEvent>(window, 'storage')
      .pipe(takeUntilDestroyed())
      .subscribe(ev => {
        if (ev.key === CURRENT_USER_KEY) {
          const newUser = ev.newValue ? JSON.parse(ev.newValue) as UserWithToken : null;
          const returnUrl = window.location.pathname + window.location.search;
          if (newUser) {
            this.handleSignIn(newUser, { isNewUser: false, returnUrl })
          }
          else {
            this.state.user$.set(null);
            this.router.navigateByUrl(returnUrl);
          }
        }
      });
  }
}


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
      client_id: '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com',
      scope: 'email profile'
    },
    linkedin: {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com',
      scope: 'email profile'
    },
    github: {
      url: 'https://github.com/login/oauth/authorize',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/account/social/callback`,
      client_id: '375730135906-ue24tu42t280a93645tb9r68sfe03jme.apps.googleusercontent.com',
      scope: 'user:read'
    }
  };

  static getUrl(provider: SocialIdp) {
    const config = this.configs[provider];
    const authUrl = new URL(config.url);
    authUrl.searchParams.set('response_type', config.response_type);
    authUrl.searchParams.set('redirect_uri', config.redirect_uri);
    authUrl.searchParams.set('client_id', config.client_id);
    if (config.scope)
      authUrl.searchParams.set('scope', config.scope);
    return authUrl;
  }
}

const CURRENT_USER_KEY = 'currentUser' as const;

export interface SignInMeta {
  isNewUser: boolean;
  [RETURN_URL_KEY]?: string;
}
