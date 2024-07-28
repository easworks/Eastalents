import { Injectable } from '@angular/core';
import type { EmailSignInInput } from 'models/validators/auth';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class AuthApi extends EasworksApi {
  readonly signin = {
    email: (input: EmailSignInInput) => {
      console.log(input);
    }
  } as const;
}