import { Country, Province } from './location';

export interface FreelancerProfile {
  image: string | null;
  currentRole: string;
  preferredRole: string;

  location: {
    country: Country;
    state: Province;
    city: string;
  }
}

// the following types define the response that we currently get for the 
// freelancer profile
export type FreelancerProfileQuestionDto = any[];