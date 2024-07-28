import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../services/auth.token';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(AuthTokenService);

  if (!req.url.startsWith('/api/'))
    return next(req);

  return from(tokenService.getToken())
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