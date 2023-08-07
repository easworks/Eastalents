import { INJECTOR, Injectable, inject } from '@angular/core';
import { DomainDictionaryDto, FreelancerProfile, IndustryGroupDto, TechGroupDto } from '@easworks/models';
import { BackendApi } from './backend';
import { CSCApi } from './csc';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends BackendApi {
  private readonly injector = inject(INJECTOR);

  readonly techGroups = () => fetch('/assets/utils/tech.json')
    .then<TechGroupDto>(this.handleJson)
    .catch(this.handleError);

  readonly industryGroups = () => fetch('/assets/utils/industries.json')
    .then<IndustryGroupDto>(this.handleJson)
    .catch(this.handleError);

  readonly profileSteps = () => this.request(`${this.apiUrl}/talentProfile/getTalentProfileSteps`)
    .then(this.handleJson)
    .then(r => r['talentProfile'] as DomainDictionaryDto)
    .catch(this.handleError);


  readonly getTalentProfile = (userId: string) => {
    const body = JSON.stringify({ userId });
    return this.request(`${this.apiUrl}/talentProfile/getTalentProfile`, { body, method: 'POST' })
      .then(this.handleJson)
      .then(r => {
        const steps = r['steps'];
        console.debug(steps);

        const p: FreelancerProfile = {} as FreelancerProfile;
        this.useDummyData(p);

        return p;
      })
      .catch(this.handleError);
  };

  // THIS FUNCTION IS MEANT TO BE REMOVED
  private async useDummyData(profile: FreelancerProfile) {
    return profile;
  }
}
