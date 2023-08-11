import { inject } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { AuthService } from '../services/auth';
import { ApiService } from './api';

export class BackendApi extends ApiService {
  protected readonly apiUrl = inject(ENVIRONMENT).apiUrl;
  private readonly auth = inject(AuthService);

  protected async headers(init?: HeadersInit) {
    const headers = new Headers({
      'content-type': 'application/json'
    });
    const token = await this.auth.token();
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

  protected override verifyOk(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        this.auth.signOut();
      }
    }
    return super.verifyOk(response);
  }
}
