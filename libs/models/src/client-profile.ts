import { EasworksServiceType, RequiredExperience, WorkEnvironment } from './job-post';
import { CSCLocation } from './location';
import { User } from './user';

export const CLIENT_TYPE_OPTIONS = [
  'Enterprise',
  'Small & Medium Business',
  'Startup',
  'Professional Services',
  'Technology Services'
] as const;

export type ClientType = typeof CLIENT_TYPE_OPTIONS[number];

export const CLIENT_SIZE_OPTIONS = [
  '1 - 10 employees',
  '11 - 50 employees',
  '51 - 100 employees',
  '101 - 500 employees',
  '501+ employees'
] as const;

export type ClientSize = typeof CLIENT_SIZE_OPTIONS[number];

export const ANNUAL_REVENUE_RANGE_OPTIONS = [
  'upto 1 million USD',
  '1 - 10 million USD',
  '10 - 50 million USD',
  '50 - 100 million USD',
  'above 100 million USD'
] as const;

export type AnnualRevenueRange = typeof ANNUAL_REVENUE_RANGE_OPTIONS[number];

export interface ClientProfile {
  user: User;
  name: string;
  description: string;

  type: ClientType;
  size: ClientSize;
  annualRevenueRange: AnnualRevenueRange;
  industry: {
    name: string;
    group: string;
  };

  hiringPreferences: {
    serviceType: EasworksServiceType[];
    experience: RequiredExperience[];
    workEnvironment: WorkEnvironment[];
  };

  domains: string[];
  softwareProducts: string[];

  location: CSCLocation;

  contact: {
    name: string;
    primary: boolean;
    email: string | null;
    phone: string | null;
    website: string | null;
  }[];
}
