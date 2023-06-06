import { Injectable, signal } from '@angular/core';
import { SocialIdp, User, AuthNotFound } from '@easworks/models';

interface PartialSocialSignup extends AuthNotFound {
  provider: SocialIdp
}

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  readonly user$ = signal<User | null>(null);
  readonly partialSocialSignIn$ = signal<PartialSocialSignup | null>(null);
}