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

export const WEEKLY_COMMITMENT_OPTIONS = [
  '10 hrs or less',
  '10 - 20 hrs',
  '20 - 30 hrs',
  '40hrs',
  'Not sure'
] as const;

export type WeeklyCommitment = typeof WEEKLY_COMMITMENT_OPTIONS[number];

export const ENGAGEMENT_PERIOD_OPTIONS = [
  '2 - 4 weeks',
  '1 - 3 months',
  '3 - 6 months',
  '6+ months',
  'Decide Later'
] as const;

export type EngagementPeriod = typeof ENGAGEMENT_PERIOD_OPTIONS[number];

export const HOURLY_BUDGET_OPTIONS = [
  'Less than $50',
  '$51 - $80',
  '$81 - $120',
  '$120 or more',
  'Decide Later'
] as const;

export type HourlyBudget = typeof HOURLY_BUDGET_OPTIONS[number];
