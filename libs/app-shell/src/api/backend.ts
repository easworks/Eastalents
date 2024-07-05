import { computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ENVIRONMENT } from '../environment';
import { AUTH_READY } from '../services/auth.ready';
import { authFeature } from '../state/auth';
import { ApiService } from './api';

export class BackendApi extends ApiService {
  protected readonly apiUrl = inject(ENVIRONMENT).apiUrl;
  private readonly store = inject(Store);
  private readonly ready = inject(AUTH_READY);
  private readonly token$ = (() => {
    const user$ = this.store.selectSignal(authFeature.selectUser);
    return computed(() => user$()?.token);
  })();

  protected async headers(init?: HeadersInit) {
    await this.ready;

    const headers = new Headers({
      'content-type': 'application/json'
    });

    const token = this.token$();
    if (token)
      headers.set('authorization', `Bearer ${token}`);

    new Headers(init).forEach((v, k) => headers.set(k, v));

    return headers;
  }

  protected async request(...args: Parameters<typeof fetch>) {

    const headers = await this.headers(args[1]?.headers);

    if (args[1]?.body instanceof FormData) {
      headers.delete('content-type');
    }

    const response = await fetch(args[0], {
      ...args[1],
      headers
    });

    return this.verifyOk(response);
  }

  protected handleJson(response: Response) {
    return response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((json: any) => {
        if (json.error || json.status === false)
          throw new Error(json.message);
        return json;
      });
  }

  // protected override verifyOk(response: Response) {
  //   if (!response.ok) {
  //     if (response.status === 401) {
  //       throw new Error('should implement sign out');
  //       // this.auth.signOut();
  //     }
  //   }
  //   return super.verifyOk(response);
  // }
}
