export const ORGANIZATION_TYPE_OPTIONS = [
  'Enterprise',
  'Small & Medium Business',
  'Startup',
  'Professional Services',
  'Technology Services'
] as const;

export type OrganizationType = typeof ORGANIZATION_TYPE_OPTIONS[number];

export const ORGANIZATION_SIZE_OPTIONS = [
  '1 - 10 Employees',
  '11 - 50 Employees',
  '51 - 100 employees',
  '101 - 500 employees',
  '501+ employees'
] as const;

export type OrganizationSize = typeof ORGANIZATION_SIZE_OPTIONS[number];

export interface EmployerProfile {
  _id: string;
  orgName: string;
  description: string;

  orgType: OrganizationType;
  orgSize: OrganizationSize;
  industry: {
    name: string;
    group: string;
  };
  software: {
    domain: string;
    products: string[];
  }[];

  location: {
    country: string;
    state: string | null;
    city: string | null;
    timezone: string;
  };

  contact: {
    email: string | null;
    phone: string | null;
    website: string | null;
  };
}
