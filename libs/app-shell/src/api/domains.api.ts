import { Injectable } from '@angular/core';
import { DomainDataDTO } from 'models/domain';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class DomainsApi extends EasworksApi {

  readonly data = () => this.http.get<DomainDataDTO>(`${this.apiUrl}/domains/data`);

}
