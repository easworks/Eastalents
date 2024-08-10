export interface ClientConfig {
  readonly version: string;
  readonly oauth: OAuthServerConfig | OAuthClientConfig;
  readonly seo: {
    readonly baseTitle: string;
    readonly defaultDescription: string;
  },
  readonly sso?: {
    readonly domain: string;
  };
}

export interface OAuthServerConfig {
  readonly type: 'server';
  readonly server: string;
  readonly endpoints: {
    readonly authorize: string;
  };
}

export interface OAuthClientConfig {
  readonly type: 'client';
  readonly server: string;
  readonly endpoints: {
    readonly authorize: string;
    readonly token: string;
  };
  readonly clientId: string;
  readonly redirect: {
    origin: string;
    path: string;
  };
}