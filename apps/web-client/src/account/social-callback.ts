import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AuthService } from '@easworks/app-shell/services/auth';
import { RETURN_URL_KEY } from '@easworks/models';
import { firstValueFrom } from 'rxjs';

export const socialCallbackGuard: CanActivateFn = async (route) => {
  const auth = inject(AuthService);
  const dialog = inject(MatDialog);
  const snackbar = inject(MatSnackBar);
  const router = inject(Router);

  try {
    const challenge = route.queryParamMap.get('state');
    if (!challenge)
      throw new Error(`'state' query parameter was expected but not found`);

    const code = route.queryParamMap.get('code');
    if (!code)
      throw new Error(`'code' query parameter was expected but not found`);


    const state = auth.socialCallback.get();

    if (!state || state.challenge !== challenge)
      throw new Error('error during social login');

    state.request.code = code;


    const result = await auth.socialCallback.getToken(state.request, {
      returnUrl: state[RETURN_URL_KEY]
    });
    // TODO: THIS CATCH CHAIN IS TEMPORARY AND SHOULD BE REMOVED
    // .catch(() => ({
    //   email: 'test@gmail.com',
    //   firstName: 'test',
    //   lastName: 'test',
    // } as SocialUserNotInDB))

    // We got back a token and a user
    if ('token' in result) {
      return false;
    }
    // user has not signed up yet. take his choice of role and sign him up
    else {
      auth.socialCallback.partialProfile$.set(result);

      const comp = await import('./social-callback.dialog')
        .then(m => m.SociallCallbackDialogComponent);

      const dialogRef = dialog.open(comp, {
        closeOnNavigation: true,
        disableClose: true
      });

      await firstValueFrom<string>(dialogRef.afterClosed());
    }
  }
  catch (e) {
    console.error(e);
    snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
    router.navigateByUrl('/account/sign-in');
  }

  return true;
};
