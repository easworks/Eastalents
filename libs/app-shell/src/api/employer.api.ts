import { Injectable } from '@angular/core';
import { EmployerProfile } from '@easworks/models';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class EmployerApi extends BackendApi {
  readonly profile = {
    get: (userId: string) => {
      const body = JSON.stringify({ userId });
      return this.request(`${this.apiUrl}/employerProfile/getEmployerProfile`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as EmployerProfile)
        .catch(this.handleError);
    },
  } as const;
}
