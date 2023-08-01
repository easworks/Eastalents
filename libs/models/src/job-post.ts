export const SERVICE_TYPE_OPTIONS = [
  'Hire an Enterprise Application Talent',
  'Assemble a Team',
  'Project Outsourcing',
  'Others'
] as const;

export type ServiceType = typeof SERVICE_TYPE_OPTIONS[number];

export const PROJECT_TYPE_OPTIONS = [
  'New',
  'Existing'
] as const;

export type ProjectType = typeof PROJECT_TYPE_OPTIONS[number];

export const REQUIRED_EXPERIENCE_OPTIONS = [
  'Entry Level',
  'Individual Contributor',
  'Mid-level Management',
  'Senior/Executive Leadership',
  'Decide Later'
] as const;

export type RequiredExperience = typeof REQUIRED_EXPERIENCE_OPTIONS[number];
