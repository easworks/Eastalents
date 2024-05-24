import { Injectable } from '@angular/core';
import { EmployerProfile } from '@easworks/models';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class EmployerApi extends BackendApi {
  readonly profile = {
    get: () => {
      return this.request(`${this.apiUrl}/employerProfile/getEmployerProfile`)
        .then(this.handleJson)
        .then(r => r.profile as EmployerProfile)
        .catch(this.handleError);
    },
    create: (profile: EmployerProfile) => {
      const body = JSON.stringify(profile);
      return this.request(`${this.apiUrl}/employerProfile/createEmployerProfile`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as EmployerProfile)
        .catch(this.handleError);
    },
    update: (profile: EmployerProfile) => {
      const body = JSON.stringify(profile);
      return this.request(`${this.apiUrl}/employerProfile/updateEmployerProfile`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as EmployerProfile)
        .catch(this.handleError);
    },

    profilePhoto: {
      get: () => this.request(`${this.apiUrl}/employerProfile/getEmployerProfilePhoto`)
        .then(this.handleJson)
        .then(r => r.photo.path)
        .catch(this.handleError),

      set: (image: File) => {
        const body = new FormData();
        body.append('employerProfilePhoto', image);

        return this.request(`${this.apiUrl}/employerProfile/setEmployerProfilePhoto`, { body, method: 'POST' })
          .then(this.handleJson)
          .then(r => r.photo.path as string)
          .catch(this.handleError);
      }
    }
  } as const;
}
