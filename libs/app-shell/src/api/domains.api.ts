import { Injectable } from '@angular/core';
import { DomainDataDTO } from '@easworks/models/domain';
import { IndustryGroupDTO } from '@easworks/models/industry';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class DomainsApi extends EasworksApi {

  readonly data = () => this.http.get<DomainDataDTO>(`${this.apiUrl}/domains/data`);
  readonly industries = () => this.http.get<IndustryGroupDTO>(`${this.apiUrl}/domains/industries`);

}
