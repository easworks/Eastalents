import { ClientConfig } from '@easworks/app-shell/esm/client-config';
import { env } from './environment';

export const clientConfig: ClientConfig = {
  version: '1.0.0',
  seo: {
    baseTitle: 'Accounts | EASWORKS',
    defaultDescription: 'Manage your EASWORKS account'
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