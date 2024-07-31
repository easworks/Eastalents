import { Injectable } from '@angular/core';
import { ContactUsRequest } from 'models/contact-us';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class ContactUsApi extends EasworksApi {

  readonly create = (input: ContactUsRequest) => this.http.post(
    `${this.apiUrl}/contactus/createContactUs`,
    input);
}
