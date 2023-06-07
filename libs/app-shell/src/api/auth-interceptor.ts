import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, concatMap, from, throwError } from 'rxjs';
import { ENVIRONMENT } from '../environment';
import { AuthService } from '../services';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {
  private readonly auth = inject(AuthService);
  private readonly apiUrl = inject(ENVIRONMENT).apiUrl;

  private readonly intercept: HttpInterceptorFn = (req, next) => {
    console.debug('intercepting', req.urlWithParams);
    const isApiUrl = req.url.startsWith(this.apiUrl);
    return from(this.auth.token).pipe(
      concatMap(token => {
        if (isApiUrl && token) {
          req = req.clone({
            setHeaders: { 'authorization': `Bearer ${token}` }
          });
        }
        return next(req).pipe(
          catchError(err => {
            if (err.status === 401) {
              this.auth.signOut()
            }
            return throwError(() => err);
          })
        );
      })
    )
  }

  public static asFunction: HttpInterceptorFn = (req, next) => {
    return inject(AuthInterceptor).intercept(req, next);
  }
}