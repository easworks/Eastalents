import { Injectable } from '@angular/core';
import type { OAuthTokenSuccessResponse } from 'models/oauth';
import type { EmailSignInInput, SignUpInput, SignUpOutput, SocialOAuthCodeExchange, SocialOAuthCodeExchangeOutput, ValidateEmailExistsInput, ValidateUsernameExistsInput } from 'models/validators/auth';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class AuthApi extends EasworksApi {

  readonly signup = (input: SignUpInput) =>
    this.http.post<SignUpOutput>(`${this.apiUrl}/auth/signup`, input);

  readonly signin = {
    email: (input: EmailSignInInput) =>
      this.http.post<OAuthTokenSuccessResponse>(`${this.apiUrl}/auth/signin/email`, input)

  } as const;

  readonly social = {
    codeExchange: (input: SocialOAuthCodeExchange) =>
      this.http.post<SocialOAuthCodeExchangeOutput>(`${this.apiUrl}/auth/social/code-exchange`, input)
  };

  readonly validate = {
    usernameExists: (input: ValidateUsernameExistsInput) =>
      this.http.post<boolean>(`${this.apiUrl}/auth/validate/username-exists`, input),
    emailExists: (input: ValidateEmailExistsInput) =>
      this.http.post<boolean>(`${this.apiUrl}/auth/validate/email-exists`, input)
  };
}