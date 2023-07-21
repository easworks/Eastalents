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

export const JOB_SEARCH_STATUS_OPTIONS = [
  'Active',
  'Passive',
  'Not Looking Actively'
] as const;

export type JobSearchStatus = typeof JOB_SEARCH_STATUS_OPTIONS[number];

export const FREELANCER_AVAILABILITY_OPTIONS = [
  'Immediately',
  '1 - 2 weeks',
  '3 - 4 weeks',
  'More than 1 month'
] as const;

export type FreelancerAvailability = typeof FREELANCER_AVAILABILITY_OPTIONS[number];

export const ENGLISH_PROFICIENCY_OPTIONS = [
  'Basic',
  'Intermediate',
  'Advanced',
  'Native/Fluent'
] as const;

export type EnglishProficiency = typeof ENGLISH_PROFICIENCY_OPTIONS[number];

export interface FreelancerProfile {
  image: string | null;
  currentRole: string;
  preferredRole: string;

  overallExperience: OverallExperience;
  commitment: Set<Commitment>;
  jobSearchStatus: JobSearchStatus;
  availability: FreelancerAvailability;

  location: {
    country: string;
    state?: string;
    city?: string;
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

