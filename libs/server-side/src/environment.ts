
export interface Environment {
  development: boolean;
  port: number;
  authHost?: string;
  mongodb?: string;
}

export const parseEnv = {
  authHost: () => {
    const origin = process.env['AUTH_HOST'] as string;

    if (!origin)
      throw new Error('auth host env variable not set');

    return origin;
  },
  mongodb: () => {
    const mongodb = process.env['MONGODB'] as string;

    if (!mongodb)
      throw new Error('mongodb env variable not set');

    return mongodb;
  },
};