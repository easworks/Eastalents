import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactUsRequest } from 'models/contact-us';
import { EasworksApi } from './easworks.api';

@Injectable({
  providedIn: 'root'
})
export class ContactUsApi extends EasworksApi {

  private readonly http = inject(HttpClient);

  readonly create = (input: ContactUsRequest) => this.http.post(
    `${this.apiUrl}/contactus/createContactUs`,
    input);
}
