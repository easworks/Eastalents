export const JOB_POST_TYPE_OPTIONS = [
  'Hire an Enterprise Application Talent',
  'Assemble a Team',
  'Project Outsourcing',
  'Others'
] as const;

export type JobPostType = typeof JOB_POST_TYPE_OPTIONS[number];
