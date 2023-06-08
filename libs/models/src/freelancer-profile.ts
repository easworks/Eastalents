export interface FreelancerProfile {
  image: string | null;
  currentRole: string;
  preferredRole: string;
  location: string;
}

// the following types define the response that we currently get for the 
// freelancer profile
export type FreelancerProfileQuestionDto = any[];