import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PermissionRecord } from 'models/permission-record';
import { User } from 'models/user';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class UsersApi extends EasworksApi {
  private readonly http = inject(HttpClient);
  readonly self = () => {
    return this.http.get<{
      user: User,
      permissionRecord: PermissionRecord;
    }>(`${this.apiUrl}/users/self`);
  };
}