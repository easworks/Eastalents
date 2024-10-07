import { Injectable } from '@angular/core';
import { DomainDataDTO } from '@easworks/models/domain';
import { IndustryGroupDTO } from '@easworks/models/industry';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class DomainsApi extends EasworksApi {

  readonly data = {
    get: () => this.http.get<DomainDataDTO>(`${this.apiUrl}/domains/data`),
    set: (value: DomainDataDTO) => this.http.post(`${this.apiUrl}/domains/data`, value)
  } as const;

  readonly industries = () => this.http.get<IndustryGroupDTO>(`${this.apiUrl}/domains/industries`);

}
