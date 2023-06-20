import { Injectable } from '@angular/core';
import { ApiResponse, DomainDictionaryDto, FreelancerProfile, FreelancerProfileQuestionDto, TechGroupDto } from '@easworks/models';
import { City, Country, State } from 'country-state-city';
import { catchError, map } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends ApiService {
  readonly techGroups = () => this.http.get<TechGroupDto>('/assets/utils/tech.json');

  readonly profileSteps = () => this.http.get<ApiResponse>(
    `${this.apiUrl}/talentProfile/getTalentProfileSteps`
  ).pipe(
    map(r => r['talentProfile'] as DomainDictionaryDto),
    catchError(this.handleError)
  );

  readonly getTalentProfile = (userId: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/talentProfile/getTalentProfile`, { userId })
      .pipe(
        map(r => {
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
        }),
        catchError(this.handleError)
      );

  // THIS FUNCTION IS MEANT TO BE REMOVED
  private useDummyData(profile: FreelancerProfile) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const country = Country.getCountryByCode('IN')!;
    const state = country && State.getStateByCodeAndCountry('WB', country.isoCode);
    const city = state && City.getCitiesOfState(state.countryCode, state.isoCode)
      .find(c => c.name === 'Kolkata');

    profile.location = {
      country: country,
      state: state,
      city: city
    }

    profile.profileCompletion = {
      about: Math.random(),
      easExperience: Math.random(),
      easSystemPhases: Math.random(),
      experience: Math.random(),
      jobRole: Math.random(),
      jobSearchStatus: Math.random(),
      overall: 0,
      rates: Math.random(),
      social: Math.random(),
      summary: Math.random(),
      techStacks: Math.random(),
      wsa: Math.random()
    };

    profile.profileCompletion.overall = Object.values(profile.profileCompletion)
      .reduce((p, c) => p + c, 0) / 11
  }
}