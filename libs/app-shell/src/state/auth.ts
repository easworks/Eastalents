import { Injectable, signal } from '@angular/core';
import { SocialUserNotInDB, UserWithToken } from '@easworks/models';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user$ = signal<UserWithToken | null>(null);
  readonly partialSocialSignIn$ = signal<SocialUserNotInDB | null>(null);
}