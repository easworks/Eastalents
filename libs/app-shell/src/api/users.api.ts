import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { UserSelfOutput } from 'models/validators/users';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class UsersApi extends EasworksApi {
  private readonly http = inject(HttpClient);
  readonly self = () => {
    return this.http.get<UserSelfOutput>(`${this.apiUrl}/users/self`);
  };
}