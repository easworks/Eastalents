import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStorageService } from '../services/auth.storage';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
      })
    );
};