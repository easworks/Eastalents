import { Injectable } from '@angular/core';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentApi extends EasworksApi {

  readonly deleteAccount = () =>
    this.http.post(`${this.apiUrl}/development/delete-account`, undefined);

}