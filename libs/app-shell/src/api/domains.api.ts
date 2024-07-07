import { Injectable } from '@angular/core';
import { DomainDictionaryDto, IndustryGroupDto, TechGroupDto } from '@easworks/models';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class DomainsApi extends BackendApi {
  readonly techGroups = () => fetch('/assets/utils/tech.json')
    .then<TechGroupDto>(this.handleJson)
    .catch(this.handleError);

  readonly industryGroups = () => fetch('/assets/utils/industries.json')
    .then<IndustryGroupDto>(this.handleJson)
    .catch(this.handleError);

  readonly allDomains = () => fetch('/assets/utils/domain-response.json')
    .then(this.handleJson)
    .then(r => r['talentProfile'] as DomainDictionaryDto)
    .catch(this.handleError);

  readonly featuredDomains = () => fetch('/assets/utils/featured-domains.json')
    .then<{
      domain: string;
      products: string[];
    }[]>(this.handleJson)
    .catch(this.handleError);

}
