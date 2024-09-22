import { Injectable } from '@angular/core';
import { EasworksApi } from './easworks.api';
import { ClientProfile } from '@easworks/models/client-profile';

@Injectable({
  providedIn: 'root'
})
export class ClientApi extends EasworksApi {

  readonly profile = {
    get: () => this.http.get<ClientProfile>(`${this.apiUrl}/client/profile`)
  } as const;
}