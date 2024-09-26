import { Environment, parseEnv } from 'server-side/environment';

export const environment = {
  id: parseEnv.nodeEnv(),
  port: Number.parseInt(process.env['PORT'] as string),
  mongodb: parseEnv.mongodb(),
  jwt: {
    publicKey: parseEnv.jwt.publicKey(),
    privateKey: parseEnv.jwt.privateKey(),
    issuer: parseEnv.jwt.issuer(),
  },
  authHost: parseEnv.authHost(),
  oauth: {
    google: parseEnv.oauth.google(),
    linkedin: parseEnv.oauth.linkedin(),
    github: parseEnv.oauth.github()
  },
  gmail: {
    senderId: parseEnv.gmail.senderId()
  },
  stripe: {
    key: parseEnv.stripe.key()
  }
} as const satisfies Environment;
