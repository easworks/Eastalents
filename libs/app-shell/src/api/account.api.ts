import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ApiService } from './api';
import { ApiResponse, EmailSignInRequest, EmailSignUpRequest, SocialSignInRequest, SocialSignUpRequest, UserWithToken } from '@easworks/models';

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

  readonly socialLogin = (input: SocialSignInRequest | SocialSignUpRequest) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/social-login`, input)
      .pipe(catchError(this.handleError));

  readonly signup = (input: EmailSignUpRequest) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/users/signup`, input)
      .pipe(
        map(r => r.result?.user as UserWithToken),
        catchError(this.handleError));

  readonly signin = (input: EmailSignInRequest) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/users/login`, input)
      .pipe(
        map(r => r.result?.user as UserWithToken),
        catchError(this.handleError))

  readonly resetPassword = {
    sendLink: (email: string) =>
      this.http.post<ApiResponse>(`${this.apiUrl}/users/forgotPassword`, { email })
        .pipe(catchError(this.handleError))
  } as const;

  readonly verifyEmail = (token: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/users/verification`, { token })
      .pipe(catchError(this.handleError))
}
