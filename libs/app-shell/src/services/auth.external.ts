import { ExternalIdentityProviderType } from 'models/identity-provider';

interface AuthRedirectConfig {
  readonly url: string;
  readonly client_id: string;
  readonly scope?: string;
}


export class AuthRedirect {
  private static readonly configs: Readonly<Record<ExternalIdentityProviderType, AuthRedirectConfig>> = {
    // demo google config
    // TODO: replace demo with actual
    google: {
      url: 'https://accounts.google.com/o/oauth2/v2/auth',
      scope: 'email profile',
      client_id: '579469758615-67877jg3b0tgiaik63p4b5qj20n8a2ng.apps.googleusercontent.com'
    },
    linkedin: {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      client_id: '860msgodp05ins',
      scope: 'openid email profile'
    },
    github: {
      url: 'https://github.com/login/oauth/authorize',
      client_id: '7ee1b0a43b73c473e120',
      scope: 'read:user user:email'
    }
  };

  static getUrl(
    provider: ExternalIdentityProviderType,
    redirect_uri: string,
    state?: string
  ) {
    const config = this.configs[provider];
    const authUrl = new URL(config.url);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirect_uri);
    authUrl.searchParams.set('client_id', config.client_id);
    if (config.scope)
      authUrl.searchParams.set('scope', config.scope);
    if (state)
      authUrl.searchParams.set('state', state);
    return authUrl;
  }
}