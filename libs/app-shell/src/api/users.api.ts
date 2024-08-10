import { Injectable } from '@angular/core';
import type { UserSelfOutput } from 'models/validators/users';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class UsersApi extends EasworksApi {
  readonly self = () => {
    return this.http.get<UserSelfOutput>(`${this.apiUrl}/users/self`);
  };
}