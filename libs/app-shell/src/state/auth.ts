import { Injectable, signal } from '@angular/core';
import { AuthNotFound, SocialIdp, UserWithToken } from '@easworks/models';

interface PartialSocialSignup extends AuthNotFound {
  provider: SocialIdp
}

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user$ = signal<UserWithToken | null>(null);
  readonly partialSocialSignIn$ = signal<PartialSocialSignup | null>(null);
}