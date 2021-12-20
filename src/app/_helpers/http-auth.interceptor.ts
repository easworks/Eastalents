import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToasterService } from '../_services/toaster.service';
import { SessionService } from '../_services/session.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(private toaster: ToasterService, private sessionService: SessionService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    const account = this.sessionService.getLocalStorageCredentials();
    const isLoggedIn = account?.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { authorization: `Bearer ${account.token}` }
      });
    }
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.toaster.error(`${err.error.message}`);
        // auto logout if 401 response returned from api
        // this.authenticationService.logout();
        // location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
