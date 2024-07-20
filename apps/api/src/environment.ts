import { Environment } from 'server-side/environment';

const devMode = process.env['NODE_ENV'] !== 'production';

export const environment: Environment = {
  development: devMode,
  port: Number.parseInt(process.env['PORT'] as string)
} as const;
