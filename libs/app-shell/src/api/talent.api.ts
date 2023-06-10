import { Injectable } from '@angular/core';
import { ApiResponse, DomainDictionaryDto, FreelancerProfile, FreelancerProfileQuestionDto } from '@easworks/models';
import { catchError, map } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends ApiService {
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
    profile.location.city = 'Kolkata';
    profile.location.state = { name: 'West Bengal', iso: 'WB' };
    profile.location.country = {
      name: 'India',
      code: 'IN',
      dialcode: '+91',
      currency: 'INR',
      flag: "🇮🇳"
    };

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