import { inject } from '@angular/core';
import { ENVIRONMENT } from '../environment';
import { AuthService } from '../services/auth';
import { ApiService } from './api';

export class BackendApi extends ApiService {
  protected readonly apiUrl = inject(ENVIRONMENT).apiUrl;
  private readonly auth = inject(AuthService);

  protected async headers(init?: HeadersInit) {
    const token = await this.auth.token();
    const headers = new Headers({
      'authorization': token ? `Bearer ${token}` : ''
    });

    new Headers(init).forEach((v, k) => headers.set(k, v));

    return headers;
  }

  protected async request(...args: Parameters<typeof fetch>) {

    const headers = await this.headers(args[1]?.headers);

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
        if (json.error)
          throw new Error(json.message);
        return json;
      })
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
