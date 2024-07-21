import { Environment, parseEnv } from 'server-side/environment';

const devMode = process.env['NODE_ENV'] !== 'production';

export const environment = {
  development: devMode,
  port: Number.parseInt(process.env['PORT'] as string),
  mongodb: parseEnv.mongodb()
} as const satisfies Environment;
