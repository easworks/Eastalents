import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpService {


    constructor(private http: HttpClient) { }

    get(url: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/${url}`).pipe(catchError(this.handleError));
    }

    post(url: string, params: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/${url}`, params).pipe(catchError(this.handleError));
    }

    put(url: string, params: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/${url}`, params).pipe(catchError(this.handleError));
    }

    delete(url: string, id: string): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/${url}/${id}`).pipe(catchError(this.handleError));
    }

    handleError(error: any): Observable<any> {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }
    getCountryStateCityBasedOnLocation(opt:{latitude:number,longitude:number}){
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${opt.latitude},${opt.longitude}&key=${environment.keyForCurrentlOCATION}`).pipe(catchError(this.handleError));
    }
    getTimezoneBasedOnLocation(opt:{latitude:number,longitude:number}){
        const timestamp = Date.now()/100;
        return this.http.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${opt.latitude},${opt.longitude}&timestamp=${timestamp}&key=${environment.keyForCurrentlOCATION}`).pipe(catchError(this.handleError));
    }
}
