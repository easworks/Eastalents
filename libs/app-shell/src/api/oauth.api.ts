import { inject, Injectable, INJECTOR } from '@angular/core';
import { Params } from '@angular/router';
import { from, switchMap } from 'rxjs';
import { OAUTH_CLIENT_CONFIG, OAUTH_HOST_CONFIG } from '../dependency-injection';
import { AuthStorageService } from '../services/auth.storage';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class OAuthApi extends EasworksApi {
  private readonly injector = inject(INJECTOR);
  private readonly storage = inject(AuthStorageService);

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

  readonly generateCode = (params: Params) => {
    const config = inject(OAUTH_HOST_CONFIG);

    return from(this.storage.token.get())
      .pipe(
        switchMap(token => {
          if (!token)
            throw new Error('token should not be null');

          return this.http.post<string>(
            config.origin + config.endpoints.authorize,
            params,
            {
              headers: {
                'authorization': `Bearer ${token}`
              },
            });
        }),

      );
  };
}