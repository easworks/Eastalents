import { Injectable } from '@angular/core';
import { ApiResponse, } from '@easworks/models';
import { catchError, map } from 'rxjs';
import { sortString } from '../utilities/sort';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class LocationApi extends ApiService {

  readonly countries = () =>
    this.http.get<ApiResponse>(`${this.apiUrl}/location/getCountries`)
      .pipe(
        map(r => {
          const countries = r['countries'] as any[];
          countries.sort((a, b) => sortString(a.name, b.name));
          return countries;
        }),
        catchError(this.handleError)
      );

  readonly states = (countryCode: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/location/getStates`, { countryCode })
      .pipe(
        map(r => r['states'] as any[]),
        catchError(this.handleError)
      );

  readonly cities = (countryCode: string, stateCode: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/location/getCities`, { countryCode, stateCode })
      .pipe(
        map(r => r['cities'] as string[]),
        catchError(this.handleError)
      );
}