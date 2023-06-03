import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { ENVIRONMENT } from '../environment';


export class ApiService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = inject(ENVIRONMENT).apiUrl;

  protected handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}