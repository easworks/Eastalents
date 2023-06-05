import { Injectable } from '@angular/core';
import { AuthNotFound, AuthSuccess, SocialAuthRequest } from '@easworks/models';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class AccountApi extends ApiService {
  /** black-listed email domains */
  private _bled: string[] | null = null;
  readonly blackListedEmailDomains = async () => {
    if (!this._bled) {
      this._bled = await firstValueFrom(this.http.get<string[]>('/assets/utils/free-email-providers.json'))
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._bled!;
  }

  readonly signIn = {
    social: (input: SocialAuthRequest) => {
      // FOR NOW, choose any one to test and develop
      return mock.social.authSucces();
      // return mock.signIn.google.authNotFound();
    }
  } as const;
}

const mock = {
  social: {
    authSucces: (): AuthSuccess => ({
      token: [{}, mock.social.authNotFound(), {}]
        .map(o => btoa(JSON.stringify(o)))
        .join('.')
    }),
    authNotFound: (): AuthNotFound => ({
      email: 'dd@gmail.com',
      firstName: 'dd',
      lastName: 'dd'
    })
  },
} as const;
