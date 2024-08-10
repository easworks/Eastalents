const environments = [
  'local',
  'development',
  'production'
] as const;

export type EnvironmentID = typeof environments[number];

