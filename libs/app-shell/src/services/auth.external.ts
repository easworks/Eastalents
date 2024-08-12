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
      client_id: '1074824567437-5ts3rfo6s011cl4il6dev2qeqvm10lc0.apps.googleusercontent.com',
      scope: 'email profile'
    },

    // actual google config
    // google: {
    //   url: 'https://accounts.google.com/o/oauth2/v2/auth',
    //   response_type: 'code',
    //   redirect_uri: `${window.location.origin}/account/social/callback`,
    //   client_id: '243499270913-h4645hc46b9dqvg6ejaidpch2g6q863r.apps.googleusercontent.com',
    //   scope: 'email profile'
    // },

    // TODO: add actual facebook data
    facebook: {
      url: 'https://github.com/login/oauth/authorize',
      client_id: '7ee1b0a43b73c473e120',
      scope: 'email profile'
    },
    linkedin: {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      client_id: '77xht7uizkpzsm',
      scope: 'r_emailaddress r_liteprofile'
    },
    github: {
      url: 'https://github.com/login/oauth/authorize',
      client_id: '7ee1b0a43b73c473e120',
      scope: 'email profile'
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