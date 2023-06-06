import { HttpClient } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { throwError } from 'rxjs';
import { ENVIRONMENT } from '../environment';


export class ApiService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = inject(ENVIRONMENT).apiUrl;
  private readonly devMode = isDevMode();

  protected readonly handleError = (error: any) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      if (this.devMode)
        console.error('client error', error);
      errorMessage = error.error.message;
    } else {
      if (this.devMode)
        console.error('server error', error);
      errorMessage = error.error.message || error.error.status || error.status;
    }
    return throwError(() => new Error(errorMessage));
  }
}