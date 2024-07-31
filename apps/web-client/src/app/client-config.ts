import { ClientConfig } from '@easworks/app-shell/esm/client-config';
import { env } from './environment';

export const clientConfig: ClientConfig = {
  version: '1.0.0',
  seo: {
    baseTitle: 'EASWORKS',
    defaultDescription: 'EASWORKS'
  },
  oauth: {
    type: 'client',
    clientId: '66a98aad5c881fc8f3ca2a57',
    redirectUri: 'http://localhost:4104/oauth/callback',
    endpoints: {
      authorize: '/api/oauth/authorize',
      token: '/api/oauth/token'
    },
    origin: env.oauth.origin,
  },
  sso: {
    domain: env.sso.domain
  }
};