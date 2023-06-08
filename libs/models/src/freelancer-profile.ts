import { Country, Province } from './location';

export interface FreelancerProfile {
  image: string | null;
  currentRole: string;
  preferredRole: string;

  location: {
    country: Country;
    state: Province;
    city: string;
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
  }
}

// the following types define the response that we currently get for the 
// freelancer profile
export type FreelancerProfileQuestionDto = any[];