import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    console.debug('auth service initialized');
  }

  readonly signin = {
    github: () => {
      console.debug('[SIGN IN] Github');
    },
    linkedIn: () => {
      console.debug('[SIGN IN] LinkedIn');
    },
    google: () => {
      console.debug('[SIGN IN] Google');
    },
    email: () => {
      console.debug('[SIGN IN] Email');
    }
  } as const;
}