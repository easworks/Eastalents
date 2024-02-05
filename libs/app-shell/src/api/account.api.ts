import { Injectable } from '@angular/core';
import { EmailSignInRequest, EmailSignUpRequest, SocialSignInRequest, SocialSignUpRequest, SocialUserNotInDB, UserWithToken } from '@easworks/models';
import { CACHE } from '../common/cache';
import { BackendApi } from './backend';

const ONE_HOUR_MS = 60 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class AccountApi extends BackendApi {
  readonly freeEmailProviders = async () => {
    const cached = await CACHE.domains.get<string[]>('free-email-providers', ONE_HOUR_MS);
    if (cached)
      return cached;

    const res = await fetch('/assets/utils/free-email-providers.json')
      .then<string[]>(this.handleJson)
      .catch(this.handleError);
    await CACHE.domains.set('free-email-providers', res);
    return res;
  };

  readonly socialLogin = (input: SocialSignInRequest | SocialSignUpRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/social-login`, { body, method: 'POST' })
      .then<UserWithToken | SocialUserNotInDB>(this.handleJson)
      .catch(this.handleError);
  };


  readonly signup = (input: EmailSignUpRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/users/signup`, { body, method: 'POST' })
      .then(this.handleJson)
      .then<{ mailSent: boolean; }>(r => r.result)
      .catch(this.handleError);
  };

  readonly signin = (input: EmailSignInRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/users/login`, { body, method: 'POST' })
      .then(this.handleJson)
      .then<UserWithToken>(r => r.result?.user)
      .catch(this.handleError);
  };

  readonly resetPassword = {
    sendLink: (email: string) => {
      const body = JSON.stringify({ email });
      return this.request(`${this.apiUrl}/users/forgotPassword`, { body, method: 'POST' })
        .then(this.handleJson)
        .catch(this.handleError);
    }
  } as const;

  readonly verifyEmail = (token: string) => {
    const body = JSON.stringify({ token });
    return this.request(`${this.apiUrl}/users/verification`, { body, method: 'POST' })
      .then(this.handleJson)
      .catch(this.handleError);
  };
}
