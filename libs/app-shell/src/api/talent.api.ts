import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TalentApi extends ApiService {
  readonly profileSteps = () => this.http.get(
    `${this.apiUrl}/talentProfile/getTalentProfileSteps`
  ).pipe(catchError(this.handleError));
}