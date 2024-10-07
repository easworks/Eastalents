import { Injectable } from '@angular/core';
import { DomainDataDTO } from '@easworks/models/domain';
import { IndustryGroupDTO } from '@easworks/models/industry';
import { EasworksApi } from './easworks.api';
import { FeaturedDomain } from '@easworks/models/featured';

@Injectable({
  providedIn: 'root'
})
export class DomainsApi extends EasworksApi {

  readonly data = {
    get: () => this.http.get<DomainDataDTO>(`${this.apiUrl}/domains/data`),
    set: (value: DomainDataDTO) => this.http.post(`${this.apiUrl}/domains/data`, value)
  } as const;

  readonly featured = {
    get: () => this.http.get<FeaturedDomain[]>(`${this.apiUrl}/domains/featured-domains`),
    set: (value: FeaturedDomain[]) => this.http.post(`${this.apiUrl}/domains/featured-domains`, value)
  } as const;

  readonly industries = () => this.http.get<IndustryGroupDTO>(`${this.apiUrl}/domains/industries`);

}
