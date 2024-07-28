import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { OAuthTokenSuccessResponse } from 'models/oauth';
import type { EmailSignInInput } from 'models/validators/auth';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class AuthApi extends EasworksApi {
  private readonly http = inject(HttpClient);
  readonly signin = {
    email: (input: EmailSignInInput) => {
      return this.http.post<OAuthTokenSuccessResponse>(`${this.apiUrl}/auth/signin/email`, input);
    }
  } as const;
}