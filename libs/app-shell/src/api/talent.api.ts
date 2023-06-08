import { Injectable } from '@angular/core';
import { ApiResponse, DomainDictionaryDto } from '@easworks/models';
import { catchError, map } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends ApiService {
  readonly profileSteps = () => this.http.get<ApiResponse>(
    `${this.apiUrl}/talentProfile/getTalentProfileSteps`
  ).pipe(
    map(r => r['talentProfile'] as DomainDictionaryDto),
    catchError(this.handleError)
  );

  readonly getTalentProfile = (userId: string) =>
    this.http.post<ApiResponse>(`${this.apiUrl}/talentProfile/getTalentProfile`, { userId })
      .pipe(
        map(r => r['steps']),
        catchError(this.handleError)
      );
}