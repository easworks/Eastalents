import { inject, Injectable, INJECTOR } from '@angular/core';
import { OAUTH_CLIENT_CONFIG } from '../dependency-injection';

@Injectable({
  providedIn: 'root'
})
export class OAuthApi {
  private readonly injector = inject(INJECTOR);
  readonly authorize = (
    code: { challenge: string; method: string; },
    state?: string
  ) => {
    const config = this.injector.get(OAUTH_CLIENT_CONFIG);
    const url = new URL(config.origin + config.endpoints.authorize);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('code_challenge', code.challenge);
    url.searchParams.set('code_challenge_method', code.method);
    url.searchParams.set('redirect_uri', config.redirectUri);
    if (state)
      url.searchParams.set('state', state);

    location.href = url.href;
  };
}