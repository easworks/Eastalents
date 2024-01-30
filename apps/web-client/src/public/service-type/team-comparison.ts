import type { GenericTeamServiceID } from './data';

export const COMPARABLES = [
  'Project Delivery Accountability',
  'Global Talent Pool',
  'Flexible Talent Matching',
  'Team Integration',
  'Project Management Outsourcing',
  'Self-Management',
  'Comprehensive Team Support',
  'Budget and Timeline Flexibility',
  'Reduced Workload for In-House team'
] as const;

export const TEAM_COMPARISON_DATA = {
  'fully-managed-team': {
    title: 'Fully Managed, Fixed Bid',
    'Project Delivery Accountability': true,
    'Global Talent Pool': true,
    'Flexible Talent Matching': false,
    'Team Integration': true,
    'Project Management Outsourcing': true,
    'Self-Management': false,
    'Comprehensive Team Support': true,
    'Budget and Timeline Flexibility': false,
    'Reduced Workload for In-House team': true
  },
  'teams-on-demand': {
    title: 'Teams On-Demand',
    'Project Delivery Accountability': false,
    'Global Talent Pool': true,
    'Flexible Talent Matching': true,
    'Team Integration': true,
    'Project Management Outsourcing': false,
    'Self-Management': true,
    'Comprehensive Team Support': true,
    'Budget and Timeline Flexibility': true,
    'Reduced Workload for In-House team': true
  }
} as const satisfies Record<
  GenericTeamServiceID,
  { [key in typeof COMPARABLES[number]]: boolean } & {
    title: string;
  }
>;
