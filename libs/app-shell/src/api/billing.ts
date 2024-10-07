import { Injectable } from '@angular/core';
import { EasworksApi } from './easworks.api';
import { CountryBillingDescriptor } from '@easworks/models/billing';

@Injectable({
  providedIn: 'root'
})
export class BillingApi extends EasworksApi {
  readonly taxIds = () => this.http.get<CountryBillingDescriptor[]>('/assets/utils/tax-ids.json');
}