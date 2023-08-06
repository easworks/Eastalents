export const EMPLOYER_TYPE_OPTIONS = [
  'Enterprise',
  'Small & Medium Business',
  'Startup',
  'Professional Services',
  'Technology Services'
] as const;

export type EmployerType = typeof EMPLOYER_TYPE_OPTIONS[number];

export const EMPLOYER_ORG_SIZE_OPTIONS = [
  '1 - 10 Employees',
  '11 - 50 Employees',
  '51 - 100 employees',
  '101 - 500 employees',
  '501+ employees'
] as const;

export type EmployerOrgSize = typeof EMPLOYER_ORG_SIZE_OPTIONS[number];
