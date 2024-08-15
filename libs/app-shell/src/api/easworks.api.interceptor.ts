import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProblemDetails } from 'models/problem-details';
import { catchError, from, switchMap } from 'rxjs';
import { AuthStorageService } from '../services/auth.storage';
import { authActions } from '../state/auth';

export const easworksApiInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(AuthStorageService);
  const store = inject(Store);

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
        const pd = ProblemDetails.fromObject(err.error);
        if (pd.type === 'invalid-bearer-token')
          store.dispatch(authActions.signOut({ payload: { revoked: true } }));
        throw pd;
      })
    );
};