import { Injectable } from '@angular/core';
import { BackendApi } from './backend';
import { ContactUsRequest } from '@easworks/models';

@Injectable({
  providedIn: 'root'
})
export class ContactUsApi extends BackendApi {
  readonly create = (input: ContactUsRequest) => {
    const body = JSON.stringify(input);
    return this.request(`${this.apiUrl}/contactus/createContactUs`, { body, method: 'POST' })
      .then(this.handleJson)
      .then<any>(r => {
        console.debug(r);
        return r;
      })
      .catch(this.handleError);;
  };
}
