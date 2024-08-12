import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ProblemDetails } from 'models/problem-details';
import { catchError, from, switchMap } from 'rxjs';
import { AuthStorageService } from '../services/auth.storage';

export const easworksApiInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(AuthStorageService);

  if (!req.url.startsWith('/api/'))
    return next(req);

  return from(storage.token.get())
    .pipe(
      switchMap(token => {
        if (!token)
          return next(req);

        req = req.clone({
          setHeaders: {
            'authorization': `Bearer ${token}`
          }
        });
        return next(req);
      }),
      catchError(err => {
        throw ProblemDetails.fromObject(err.error);
      })
    );
};