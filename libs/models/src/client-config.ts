export interface ClientConfig {
  readonly version: string;
  readonly oauth: OAuthHostConfig | OAuthClientConfig;
  readonly seo: {
    readonly baseTitle: string;
    readonly defaultDescription: string;
  },
  readonly sso?: {
    readonly domain: string;
  };
}

export interface OAuthHostConfig {
  readonly type: 'host';
  readonly origin: string;
  readonly endpoints: {
    readonly authorize: string;
  };
}

export interface OAuthClientConfig {
  readonly type: 'client';
  readonly origin: string;
  readonly endpoints: {
    readonly authorize: string;
    readonly token: string;
  };
  readonly clientId: string;
  readonly redirectUri: string;
  readonly callbackPath: string;
}