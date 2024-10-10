import { Injectable } from '@angular/core';
import { DomainDataDTO } from '@easworks/models/domain';
import { FeaturedDomain } from '@easworks/models/featured';
import { IndustryGroupDTO } from '@easworks/models/industry';
import { EasworksApi } from './easworks.api';
import { KeyValDocument } from '@easworks/models/keyval';

@Injectable({
  providedIn: 'root'
})
export class DomainsApi extends EasworksApi {

  readonly data = {
    /** 
     * @returns `true` if the version has not changed, the document otherwise 
     * 
     * Note: transferCache is disabled because we don't want server to send over massive json payloads in the transfer cache
     * 
    */
    get: <V extends string>(version?: V) => {
      type docType = KeyValDocument<DomainDataDTO>;
      type result = typeof version extends string ? true | docType : docType;

      const params = version ? { version } : undefined;

      return this.http.get<result>(`${this.apiUrl}/domains/data`, { params });
    },
    set: (value: DomainDataDTO) => this.http.post(`${this.apiUrl}/domains/data`, value)
  } as const;

  readonly featured = {
    get: () => this.http.get<FeaturedDomain[]>(`${this.apiUrl}/domains/featured-domains`),
    set: (value: FeaturedDomain[]) => this.http.post(`${this.apiUrl}/domains/featured-domains`, value)
  } as const;

  readonly industries = () => this.http.get<IndustryGroupDTO>(`${this.apiUrl}/domains/industries`);

}
