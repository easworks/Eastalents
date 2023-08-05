import { Injectable } from '@angular/core';
import { EmailSignInRequest, EmailSignUpRequest, SocialSignInRequest, SocialSignUpRequest, SocialUserNotInDB, UserWithToken } from '@easworks/models';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class AccountApi extends BackendApi {
  /** black-listed email domains */
  private _bled?: Promise<string[]>;
  readonly blackListedEmailDomains = async () => {
    if (!this._bled) {
      this._bled = fetch('/assets/utils/free-email-providers.json')
        .then<string[]>(this.handleJson)
        .catch(this.handleError);
    }
    return this._bled;
  }

  readonly socialLogin = (input: SocialSignInRequest | SocialSignUpRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/social-login`, { body, method: 'POST' })
      .then<UserWithToken | SocialUserNotInDB>(this.handleJson)
      .catch(this.handleError);
  }


  readonly signup = (input: EmailSignUpRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/users/signup`, { body, method: 'POST' })
      .then(this.handleJson)
      .then<UserWithToken>(r => r.result?.user)
      .catch(this.handleError);
  }

  readonly signin = (input: EmailSignInRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/users/login`, { body, method: 'POST' })
      .then(this.handleJson)
      .then<UserWithToken>(r => r.result?.user)
      .catch(this.handleError);
  }

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
  }
}
