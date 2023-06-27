import { ICity, ICountry, IState } from 'country-state-city';
import { ExperienceData } from './expertise';

export const OVERALL_EXPERIENCE_OPTIONS = [
  'Less than 2 years',
  '2 to 5 years',
  '5 - 10 years',
  'More than 10 years'
] as const;

export type OverallExperience = typeof OVERALL_EXPERIENCE_OPTIONS[number];

export const COMMITMENT_OPTIONS = [
  'Part-time (20hrs/week)',
  'Full-time (40hrs/week)',
  'Hourly',
  'Monthly',
  'Project milestone based',
] as const;

export type Commitment = typeof COMMITMENT_OPTIONS[number];

export interface FreelancerProfile {
  image: string | null;
  currentRole: string;
  preferredRole: string;

  overallExperience: OverallExperience;
  commitment: Set<Commitment>;

  location: {
    country: ICountry;
    state?: IState;
    city?: ICity;
  };

  summary: string;

  primaryDomainExperience: ExperienceData;
  enterpriseSoftwareExperience: ExperienceData[];

  // DISCUSS: for the profile completion, the value could be
  // 1. decimals between 0 and 1 (inclusive), OR
  // 2. integers between 0 and 100 (inclusive)
  // whatever choice is made, it must be applied to all
  // mixing is not allowed
  profileCompletion: {
    overall: number;
    summary: number;
    easExperience: number;
    easSystemPhases: number;
    jobRole: number;
    experience: number;
    techStacks: number;
    jobSearchStatus: number;
    rates: number;
    about: number;
    social: number;
    wsa: number;
  }
}

// the following types define the response that we currently get for the 
// freelancer profile
export type FreelancerProfileQuestionDto = any[];

