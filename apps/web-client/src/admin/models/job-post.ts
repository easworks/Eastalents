export const EASWORKS_SERVICE_TYPE_OPTIONS = [
  'Hire Contractors',
  'Hire Full-Time',
  'Fully Managed Team',
  'Get a Managed End-to-End Solution'
] as const;

export type EasworksServiceType = typeof EASWORKS_SERVICE_TYPE_OPTIONS[number];


export const POSITION_TYPE_OPTIONS = [
  'Part-Time',
  'Full-Time',
  'Hourly Basis'
] as const;

export type PositionType = typeof POSITION_TYPE_OPTIONS[number];


export const NEW_PROJECT_TYPE_OPTIONS = [
  'Greenfield Projects',
  'Pilot Projects',
  'Proof of Concept (PoC)',
  'Compliance & Regulatory Projects'
] as const;

export type NewProjectType = typeof NEW_PROJECT_TYPE_OPTIONS[number];


export const EXISTING_PROJECT_TYPE_OPTIONS = [
  'Maintenance and Support Projects',
  'Enhancement Projects',
  'Performance Optimization Projects',
  'Security Enhancement Projects',
  'UI/UX Improvement Projects',
  'Data Migration & Management Projects',
  'Integration Projects',
  'Modernization Projects',
  'Migration Projects',
  'Infrastructure Projects',
  'Business Process Automation Projects',
  'Scalability Projects',
  'Disaster Recovery and Business Continuity Projects',
  'Analytics and Business Intelligence Projects',
  'DevOps and Continuous Integration/Continuous Deployment (CI/CD) Projects',
  'Customer Experience (CX) Enhancement Projects',
] as const;

export type ExistingProjectType = typeof EXISTING_PROJECT_TYPE_OPTIONS[number];

export type ProjectType = NewProjectType | ExistingProjectType;

export const REQUIRED_EXPERIENCE_OPTIONS = [
  'Entry Level (0-1 yrs)',
  'Intermediate (1-3 yrs)',
  'Mid-Senior (3-5 yrs)',
  'Senior (5-8 yrs)',
  'Senior+ (8-10 yrs)',
  'Staff+ (10+ yrs)',
  'Senior/Executive Leadership (15+)',
] as const;

export type RequiredExperience = typeof REQUIRED_EXPERIENCE_OPTIONS[number];


export const WEEKLY_COMMITMENT_OPTIONS = [
  '10 hrs or less',
  '10 - 20 hrs',
  '20 - 30 hrs',
  '40 hrs'
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
  'Approved',
  'Hiring',
  'Complete',
] as const;

export type JobPostStatus = typeof JOB_POST_STATUS_OPTIONS[number];

export const JOB_POST_CANCELLATION_STATUS_OPTIONS = [
  'Awaiting Cancellation',
  'Cancelled'
] as const;
export type JobPostCancellationStatus = typeof JOB_POST_CANCELLATION_STATUS_OPTIONS[number];


export interface JobPost {
  _id: string;
  status: {
    current: JobPostStatus;
    cancellation: JobPostCancellationStatus | null;
  };
  createdBy: string;


  easworksServiceType: EasworksServiceType;
  projectType: ProjectType;
  projectKickoff: ProjectKickoffTimeline;


  domain: {
    id: string;
    modules: string[];
    services: string[];
  };

  roles: JobPostRole[];

  industries: {
    group: string;
    items: string[];
  }[];


  metrics: JobMetrics;
}

export interface JobPostRole {
  role: string;
  software: string[];
  techSkills: string[];

  positions: JobPostPosition;
  description: string;

  metrics: JobMetrics;
}

export interface JobPostPosition {
  type: PositionType;
  quantity: number;
  experience: RequiredExperience;
  engagement: PartTimeEngagement | FullTimeEngagement;
}

interface EngagementBase {
  environment: WorkEnvironment;
  period: EngagementPeriod;
}

interface PartTimeEngagement extends EngagementBase {
  type: 'part-time';
  commitment: WeeklyCommitment;
  budget: HourlyBudget;
}

interface FullTimeEngagement extends EngagementBase {
  type: 'full-time';
  salary: number;
}

export interface JobMetrics {
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
}