export const JOB_TYPE_OPTIONS = [
  'Hire an Enterprise Application Talent',
  'Assemble a Team',
  'Project Outsourcing',
  'Contract-to-Hire / Direct Hire an Individual'
] as const;

export type JobType = typeof JOB_TYPE_OPTIONS[number];

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
] as const;

export type RequiredExperience = typeof REQUIRED_EXPERIENCE_OPTIONS[number];

export const WEEKLY_COMMITMENT_OPTIONS = [
  '10 hrs or less',
  '10 - 20 hrs',
  '20 - 30 hrs',
  '40 hrs',
  'Not sure'
] as const;

export type WeeklyCommitment = typeof WEEKLY_COMMITMENT_OPTIONS[number];

export const ENGAGEMENT_PERIOD_OPTIONS = [
  '2 - 4 weeks',
  '1 - 3 months',
  '3 - 6 months',
  '6+ months',
] as const;

export type EngagementPeriod = typeof ENGAGEMENT_PERIOD_OPTIONS[number];

export const HOURLY_BUDGET_OPTIONS = [
  'Less than $50',
  '$51 - $80',
  '$81 - $120',
  '$120 or more',
] as const;

export type HourlyBudget = typeof HOURLY_BUDGET_OPTIONS[number];

export const PROJECT_KICKOFF_TIMELINE_OPTIONS = [
  'Immediately',
  '1 - 2 weeks',
  '3 - 4 weeks',
  'More than 1 month'
] as const;

export type ProjectKickoffTimeline = typeof PROJECT_KICKOFF_TIMELINE_OPTIONS[number];

export const WORK_ENVIRONMENT_OPTIONS = [
  'On-Premise',
  'Remote',
  'Hybrid',
] as const;

export type WorkEnvironment = typeof WORK_ENVIRONMENT_OPTIONS[number];

export const JOB_POST_STATUS_OPTIONS = [
  'Awaiting Approval',
  'Active',
  'Hiring',
  'In Progress',
  'Complete',
  'Awaiting Cancellation',
  'Cancelled'
] as const;

export type JobPostStatus = typeof JOB_POST_STATUS_OPTIONS[number];

export interface JobPost {
  _id: string;
  jobType: JobType;

  domain: {
    key: string;
    years: number;
    services: string[];
    modules: string[];
    roles: {
      role: string;
      quantity: number;
      years: number;
      software: string[];
    };
  };

  tech: {
    group: string;
    items: string[];
  }[];
  industries: {
    group: string;
    items: string[];
  }[];

  description: string;
  projectType: ProjectType;
  requirements: {
    experience: RequiredExperience;
    commitment: WeeklyCommitment;
    engagementPeriod: EngagementPeriod;
    hourlyBudget: HourlyBudget;
    projectKickoff: ProjectKickoffTimeline;
    environment: WorkEnvironment;
  };

  status: JobPostStatus;

  createdBy: string;

  count: {
    // the number of positions in this job listing
    positions: number;

    // the number of individual people who have applied
    applications: number;

    // the number of applicants who have been hired
    hired: number;

    // the number of applicants who have been rejected 
    rejected: number;

    // the number of applicants who are currently being interviewed
    interviewScheduled: number;

    // the number of applicants who have not been processed yet
    unseen: number;
  };
}
