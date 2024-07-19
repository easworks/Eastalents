import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactUsRequest } from '@easworks/models';
import { BackendApi } from './backend';

@Injectable({
  providedIn: 'root'
})
export class ContactUsApi extends BackendApi {

  private readonly http = inject(HttpClient);

  readonly create = (input: ContactUsRequest) => this.http.post(
    `${this.apiUrl}/contactus/createContactUs`,
    input);
}
