import { Injectable, input } from '@angular/core';
import type { OAuthTokenSuccessResponse } from 'models/oauth';
import type { EmailSignInInput, PasswordResetInput, SendEmailVerificationCodeInput, SendPasswordResetVerificationCodeInput, SignUpInput, SignUpOutput, SocialOAuthCodeExchange, SocialOAuthCodeExchangeOutput, ValidateEmailInput, ValidateUsernameInput, VerifyEmailVerificationCodeInput, VerifyPasswordResetVerificationCodeInput } from 'models/validators/auth';
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

  readonly emailVerification = {
    sendCode: (input: SendEmailVerificationCodeInput) =>
      this.http.post<true>(`${this.apiUrl}/auth/email-verification/send-code`, input),
    verifyCode: (input: VerifyEmailVerificationCodeInput) =>
      this.http.post<true>(`${this.apiUrl}/auth/email-verification/verify-code`, input)
  };

  readonly passwordReset = {
    sendCode: (input: SendPasswordResetVerificationCodeInput) =>
      this.http.post<true>(`${this.apiUrl}/auth/reset-password/send-code`, input),
    verifyCode: (input: VerifyPasswordResetVerificationCodeInput) =>
      this.http.post<true>(`${this.apiUrl}/auth/reset-password/verify-code`, input),
    setPassword: (input: PasswordResetInput) =>
      this.http.post<true>(`${this.apiUrl}/auth/reset-password`, input),
  };

  readonly validate = {
    usernameExists: (input: ValidateUsernameInput) =>
      this.http.post<boolean>(`${this.apiUrl}/auth/validate/username-exists`, input),
    email: {
      exists: (input: ValidateEmailInput) =>
        this.http.post<boolean>(`${this.apiUrl}/auth/validate/email-exists`, input),
      isFree: (input: ValidateEmailInput) =>
        this.http.post<boolean>(`${this.apiUrl}/auth/validate/email-is-free`, input)
    }
  };
}