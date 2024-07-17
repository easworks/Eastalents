
export interface Environment {
  development: boolean;
  port?: number;
  authHost?: string;
}

export const parseEnv = {
  authHost: () => {
    const origin = process.env['AUTH_HOST'] as string;

    if (!origin)
      throw new Error('auth host env variable not set');

    return origin;
  },
};