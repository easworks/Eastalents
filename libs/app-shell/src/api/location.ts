import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { ApiResponse, Country } from '@easworks/models';
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

}