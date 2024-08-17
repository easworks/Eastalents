import { EnvironmentID } from 'models/environment';

export interface Environment {
  id: EnvironmentID;
  port: number;
  authHost?: {
    host: string;
    oauthHandler: string;
  };
  mongodb?: string;
  jwt?: {
    publicKey: string;
    privateKey: string;
    issuer: string;
  };
  oauth?: {
    google: {
      id: string;
      secret: string;
    };
    linkedin: {
      id: string;
      secret: string;
    };
    github: {
      id: string;
      secret: string;
    };
  };
  gmail?: {
    support?: {
      id: string;
      address: string;
    };
  };
}

export const parseEnv = {
  nodeEnv: () => {
    const env = process.env['NODE_ENV'];
    if (!env)
      throw new Error('NODE_ENV not provided');
    return env as EnvironmentID;
  },
  authHost: () => {
    const host = process.env['AUTH_HOST'] as string;
    const oauthHandler = process.env['AUTH_HOST_OAUTH_HANDLER'] as string;

    if (!host || !oauthHandler)
      throw new Error('auth host not provided');
    return { host, oauthHandler };
  },
  oauth: {
    google: () => parseEnv.oauth.forProvider('GOOGLE'),
    linkedin: () => parseEnv.oauth.forProvider('LINKEDIN'),
    github: () => parseEnv.oauth.forProvider('GITHUB'),
    forProvider: (provider: string) => {
      const idKey = `${provider}_OAUTH_CLIENT_ID`;
      const id = process.env[idKey];
      if (!id)
        throw new Error(`${idKey} not provided`);

      const secretKey = `${provider}_OAUTH_CLIENT_SECRET`;
      const secret = process.env[secretKey];
      if (!secret)
        throw new Error(`${secretKey} not provided`);
      return { id, secret } as const;
    }
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
  },
  gmail: {
    support: () => {
      const id = process.env['GMAIL_SUPPORT_ID'];
      const address = process.env['GMAIL_SUPPORT_ADDRESS'];

      if (!id)
        throw new Error('gmail sender id not provided');
      if (!address)
        throw new Error('gmail address not provided');

      return { id, address } as const;
    }
  }
};