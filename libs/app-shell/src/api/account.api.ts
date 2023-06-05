import { Injectable } from '@angular/core';
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
    google: (input: GoogleAuthRequest) => {
      if (input.code)
        return mock.signIn.google.authSucces();
      else
        return mock.signIn.google.authSucces();
    }
  } as const;
}

export interface GoogleAuthRequest {
  code: string
}

export interface EmailAuthRequest {
  email: string;
  password: string;
}

interface AuthSuccess {
  token: string;
}

interface AuthNotFound {
  firstName?: string;
  lastName?: string;
  email: string;
}

export type AuthResponse = AuthSuccess | AuthNotFound;

const mock = {
  signIn: {
    google: {
      authSucces: (): AuthSuccess => ({
        token: [{}, mock.signIn.google.authNotFound(), {}]
          .map(o => btoa(JSON.stringify(o)))
          .join('.')
      }),
      authNotFound: (): AuthNotFound => ({
        email: 'dd@gmail.com',
        firstName: 'dd',
        lastName: 'dd'
      })
    }
  },
} as const;
