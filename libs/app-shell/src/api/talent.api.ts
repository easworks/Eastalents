import { INJECTOR, Injectable, inject } from '@angular/core';
import { DomainDictionaryDto, FreelancerProfile, FreelancerProfileQuestionDto, IndustryGroupDto, TechGroupDto } from '@easworks/models';
import { BackendApi } from './backend';
import { CSCApi } from './csc';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends BackendApi {
  private readonly injector = inject(INJECTOR);

  readonly techGroups = () => fetch('/assets/utils/tech.json')
    .then<TechGroupDto>(this.handleJson)
    .catch(this.handleError)

  readonly industryGroups = () => fetch('/assets/utils/industries.json')
    .then<IndustryGroupDto>(this.handleJson)
    .catch(this.handleError)

  readonly profileSteps = () => this.request(`${this.apiUrl}/talentProfile/getTalentProfileSteps`)
    .then(this.handleJson)
    .then(r => r['talentProfile'] as DomainDictionaryDto)
    .catch(this.handleError)


  readonly getTalentProfile = (userId: string) => {
    const body = JSON.stringify({ userId });
    return this.request(`${this.apiUrl}/talentProfile/getTalentProfile`, { body })
      .then(this.handleJson)
      .then(r => {
        const steps = r['steps'] as FreelancerProfileQuestionDto;
        console.debug(steps);

        const pdo = steps[2].option.find((o: any) => o.selected);

        const p: FreelancerProfile = {
          image: null,

          currentRole: steps[11].data.currentPLM,
          preferredRole: steps[11].data.preferredPLM,

          location: {
            country: steps[1].country,
            state: steps[1].state,
            city: steps[1].city,
          },

          summary: steps[1].profileSummary,
          overallExperience: '2 to 5 years',
          commitment: new Set(),
          jobSearchStatus: 'Active',
          availability: 'Immediately',

          primaryDomainExperience: {
            name: pdo.value,
            years: Number.parseInt(pdo.noOfYear),
            skill: pdo.skill
          },

          enterpriseSoftwareExperience: [],

          profileCompletion: null as unknown as FreelancerProfile['profileCompletion']
        }

        this.useDummyData(p);

        return p;
      })
      .catch(this.handleError);
  }

  // THIS FUNCTION IS MEANT TO BE REMOVED
  private async useDummyData(profile: FreelancerProfile) {
    const csc = this.injector.get(CSCApi);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const country = (await csc.allCountries()).find(c => c.iso2 === 'IN');
    if (!country)
      throw new Error('could not find India in the list');
    const state = (await csc.allStates(country.iso2)).find(s => s.iso2 === 'WB');
    const city = state && (await csc.allCities(state.country_code, state.iso2))
      .find(c => c.name === 'Kolkata');

    profile.location = {
      country: country.name,
      state: state?.name,
      city: city?.name
    }

    const pc = new Array(12).fill(0).map(() => Math.random())

    profile.profileCompletion = {
      about: pc[0],
      easExperience: pc[1],
      easSystemPhases: pc[2],
      experience: pc[3],
      jobRole: pc[4],
      jobSearchStatus: pc[5],
      overall: pc[6],
      rates: pc[7],
      social: pc[8],
      summary: pc[9],
      techStacks: pc[10],
      wsa: pc[12],
      completed: false
    };

  }
}
