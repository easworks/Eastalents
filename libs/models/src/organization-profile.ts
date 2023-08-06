export const ORGANIZATION_TYPE_OPTIONS = [
  'Enterprise',
  'Small & Medium Business',
  'Startup',
  'Professional Services',
  'Technology Services'
] as const;

export type OrganizationType = typeof ORGANIZATION_TYPE_OPTIONS[number];

export const EMPLOYEE_SIZE_OPTIONS = [
  '1 - 10 Employees',
  '11 - 50 Employees',
  '51 - 100 employees',
  '101 - 500 employees',
  '501+ employees'
] as const;

export type EmployeeSize = typeof EMPLOYEE_SIZE_OPTIONS[number];
