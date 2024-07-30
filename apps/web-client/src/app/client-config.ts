import { ClientConfig } from '@easworks/app-shell/esm/client-config';
import { env } from './environment';

export const clientConfig: ClientConfig = {
  version: '1.0.0',
  seo: {
    baseTitle: 'EASWORKS',
    defaultDescription: 'EASWORKS'
  },
  oauth: {
    type: 'host',
    endpoints: {
      authorize: '/api/oauth/authorize'
    },
    origin: env.oauth.origin
  },
  sso: {
    domain: env.sso.domain
  }
};