import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AccountApi } from '@easworks/app-shell/api/account.api';
import { ErrorSnackbarDefaults, SnackbarComponent, SuccessSnackbarDefaults } from '@easworks/app-shell/notification/snackbar';
import { firstValueFrom } from 'rxjs';

export const emailVerificationGuard: CanActivateFn = async (route) => {
  const token = route.queryParamMap.get('token');
  const snackbar = inject(MatSnackBar);
  const router = inject(Router);

  if (!token) {
    snackbar.openFromComponent(SnackbarComponent, {
      ...ErrorSnackbarDefaults,
      data: { message: 'Invalid Request' }
    });
  }
  else {
    const api = inject(AccountApi);
    await firstValueFrom(api.verifyEmail(token))
      .then(() => {
        snackbar.openFromComponent(SnackbarComponent, SuccessSnackbarDefaults)
      })
      .catch(e => {
        snackbar.openFromComponent(SnackbarComponent, {
          ...ErrorSnackbarDefaults,
          data: { message: e.message }
        })
      });
  }

  return router.navigateByUrl('/account/sign-in');
}