import { JobPost, ProjectKickoffTimeline } from './job-post';

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

export const EMPLOYMENT_OPPORTUNITY_OPTIONS = [
  'Short Term Freelance/Contract',
  'Long Term Freelance/Contract',
  'Full-Time Salaried Employee',
] as const;

export type EmploymentOpportunity = typeof EMPLOYMENT_OPPORTUNITY_OPTIONS[number];



export const ENGLISH_PROFICIENCY_OPTIONS = [
  'Basic',
  'Intermediate',
  'Advanced',
  'Native/Fluent'
] as const;

export type EnglishProficiency = typeof ENGLISH_PROFICIENCY_OPTIONS[number];

export const FREEELANCER_SIGNUP_REASON_OPTIONS = [
  'Want to work on challenging enterprise application projects',
  'Want to increase sources of income',
  'Want the flexibility and freedom of working remotely',
  'Want to learn about new enterprise applications and associated technical skills',
  'Want to work with elite companies',
  'Joining based on word-of-mouth reference',
  'Joining based on positive online reviews',
  'Want to be part of the EAS community',
  'Other'
] as const;
export type FreelancerSignupReason = typeof FREEELANCER_SIGNUP_REASON_OPTIONS[number];

export interface FreelancerProfile {
  _id: string;
  experience: {
    domains: {
      key: string;
      years: number;
      services: {
        key: string;
        years: number;
      }[];
      modules: string[];
      products: {
        key: string;
        years: number;
      }[];
      roles: {
        key: string;
        years: number;
      }[];
    }[],
    tech: JobPost['tech'];
    industries: JobPost['industries'];
  };

  workPreference: {
    commitment: Commitment[];
    rates: {
      hourly: number | null;
      monthly: number | null;
      annually: number | null;
    };
    roles: {
      domain: string;
      roles: string[];
    }[];
    time: {
      timezone: string;
      start: string;
      end: string;
    },
    searchStatus: JobSearchStatus;
    interest: EmploymentOpportunity[];
    availability: ProjectKickoffTimeline;
  };

  personalDetails: {
    firstName: string;
    lastName: string;
    image: string | null;
    resume: string | null;
    location: {
      country: string;
      state: string | null;
      city: string | null;
      timezone: string;
    };
    citizenship: string | null;
    signupReason: FreelancerSignupReason | null;
    contact: {
      email: string;
      phone: {
        mobile: string | null;
        whatsapp: string | null;
        telegram: string | null;
      };
      address: {
        line1: string;
        line2: string | null;
        country: string;
        state: string | null;
        city: string | null;
        postalCode: string;
      } | null;
    };
    social: {
      linkedin: string | null;
      github: string | null;
      gitlab: string | null;
    };
    education: EducationHistory[];
  };

  professionalDetails: {
    summary: string;
    overallExperience: OverallExperience;
    currentRole: string;
    wasFreelancer: boolean;
    englishProficiency: EnglishProficiency;
    portfolio: string | null;
    history: WorkHistory[];
  };

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
    completed: boolean;
  };
}

export interface WorkHistory {
  domain: string;
  role: string;
  duration: {
    start: number;
    end: number | null;
  };
  client: string | null;
  skills: string | null;
}

export interface EducationHistory {
  qualification: string;
  specialization: string | null;
  duration: {
    start: number;
    end: number | null;
  };
  institution: string;
  location: string;
}
