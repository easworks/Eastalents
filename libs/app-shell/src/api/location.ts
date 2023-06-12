import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { ApiResponse, Country, Province } from '@easworks/models';
import { catchError, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationApi extends ApiService {

  readonly countries = () =>
    this.http.get<ApiResponse>(`${this.apiUrl}/location/getCountries`)
      .pipe(
        map(r => r['countries'] as Country[]),
        catchError(this.handleError)
      );

  readonly provinces = (countryCode: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/location/getStates`, { countryCode })
      .pipe(
        map(r => r['states'] as Province[]),
        catchError(this.handleError)
      );

  readonly cities = (countryCode: string, stateCode: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/location/getCities`, { countryCode, stateCode })
      .pipe(
        map(r => r['cities'] as string[]),
        catchError(this.handleError)
      );
}