export const BUSINESS_TYPE_OPTIONS = [
  'Enterprise',
  'Small & Medium Business',
  'Startup',
  'Professional Services',
  'Technology Services'
] as const;

export type BusinessType = typeof BUSINESS_TYPE_OPTIONS[number]
