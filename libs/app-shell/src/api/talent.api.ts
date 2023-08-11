import { Injectable } from '@angular/core';
import { FreelancerProfile } from '@easworks/models';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends BackendApi {
  readonly profile = {
    get: (userId: string) => {
      const body = JSON.stringify({ userId });
      return this.request(`${this.apiUrl}/talentProfile/getTalentProfile`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => {
          const steps = r['steps'];
          console.debug(steps);

          const p: FreelancerProfile = {} as FreelancerProfile;
          return p;
        })
        .catch(this.handleError);
    },

    create: (profile: FreelancerProfile) => {
      const body = JSON.stringify({ profile });
      return this.request(`${this.apiUrl}/talentProfile/createTalentProfile`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as FreelancerProfile)
        .catch(this.handleError);
    },

    uploadResume: (resume: File) => {
      const body = new FormData();
      body.append('talentProfileResume', resume);

      return this.request(`${this.apiUrl}/talentProfile/setTalentProfileResume`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as FreelancerProfile)
        .catch(this.handleError);
    },

    uploadImage: (image: File) => {
      const body = new FormData();
      body.append('talentProfilePhoto', image);

      return this.request(`${this.apiUrl}/talentProfile/setTalentProfilePhoto`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as FreelancerProfile)
        .catch(this.handleError);
    },

    uploadVideo: (video: File) => {
      const body = new FormData();
      body.append('talentProfileVideo', video);

      return this.request(`${this.apiUrl}/talentProfile/setTalentProfileVideo`, { body, method: 'POST' })
        .then(this.handleJson)
        .then(r => r.profile as FreelancerProfile)
        .catch(this.handleError);
    }
  } as const;
}
