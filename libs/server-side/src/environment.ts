
export interface Environment {
  development: boolean;
  port: number;
  authHost?: string;
  mongodb?: string;
  jwt?: {
    publicKey: string;
    privateKey: string;
    issuer: string;
  };
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
  jwt: {
    publicKey: () => {
      const key = process.env['JWT_PUBLIC_KEY'] as string;

      if (!key)
        throw new Error('jwt public key not provided');

      return key;
    },
    privateKey: () => {
      const key = process.env['JWT_PRIVATE_KEY'] as string;

      if (!key)
        throw new Error('jwt private key not provided');

      return key;
    },
    issuer: () => {
      const value = process.env['JWT_ISSUER'] as string;

      if (!value)
        throw new Error('jwt issuer not provided');

      return value;
    }
  }
};