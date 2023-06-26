import { Injectable } from '@angular/core';
import { ApiResponse, DomainDictionaryDto, FreelancerProfile, FreelancerProfileQuestionDto, IndustryGroupDto, TechGroup, TechGroupDto } from '@easworks/models';
import { catchError, map } from 'rxjs';
import { sortString } from '../utilities/sort';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends ApiService {
  readonly techGroups = () => this.http.get<TechGroupDto>('/assets/utils/tech.json')
    .pipe(
      map(r => Object.keys(r).map<TechGroup>(key => ({
        name: key,
        items: new Set(r[key])
      }))),
      catchError(this.handleError)
    );
  readonly industryGroups = () => this.http.get<IndustryGroupDto>('/assets/utils/industries.json')
    .pipe(
      map(r => Object.keys(r).map<IndustryGroup>(key => ({
        name: key,
        industries: r[key]
      }))),
      catchError(this.handleError)
    );

  readonly profileSteps = () => this.http.get<ApiResponse>(
    `${this.apiUrl}/talentProfile/getTalentProfileSteps`
  ).pipe(
    map(r => {
      const dto = r['talentProfile'] as DomainDictionaryDto

      return Object.keys(dto).map(dk => {
        const d: Domain = {
          key: dk,
          longName: dto[dk]['Primary Domain'],
          prefix: dto[dk]['Role-Prefix and Product-Suffix'],
          services: dto[dk].Services,
          modules: Object.entries(dto[dk].Modules).map(([mk, v]) => {
            const m: DomainModule = {
              name: mk,
              roles: v['Job roles'].sort(sortString),
              products: v.Product.sort((a, b) => sortString(a.name, b.name))
            };
            return m;
          }).sort((a, b) => sortString(a.name, b.name))
        };
        return d;
      }).sort((a, b) => sortString(a.key, b.key))
    }),
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
  private async useDummyData(profile: FreelancerProfile) {
    const { Country, State, City } = await import('country-state-city');
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

export interface Domain {
  key: string;
  longName: string;
  prefix: string | null;
  services: string[];
  modules: DomainModule[];
}

export interface DomainModule {
  name: string;
  roles: string[];
  products: DomainProduct[];
}

export interface DomainProduct {
  name: string;
  imageUrl: string;
}

export interface IndustryGroup {
  name: string;
  industries: string[];
}