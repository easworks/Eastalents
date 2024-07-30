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
    clientId: '669fdb35cfa00a8ba5f3b800',
    redirectUri: 'http://localhost:4104',
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