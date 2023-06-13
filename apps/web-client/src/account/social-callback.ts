import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, AuthState, ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell';
import { RETURN_URL_KEY, Role, SocialUserNotInDB } from '@easworks/models';
import { firstValueFrom } from 'rxjs';

export const socialCallbackGuard: CanActivateFn = async (route) => {
  const challenge = route.queryParamMap.get('state');
  if (!challenge)
    throw new Error(`'state' query parameter was expected but not found`);

  const code = route.queryParamMap.get('code');
  if (!code)
    throw new Error(`'code' query parameter was expected but not found`);

  const auth = inject(AuthService);

  const state = auth.socialCallback.get();

  if (!state || state.challenge !== challenge)
    throw new Error('error during social login');

  state.request.code = code;

  const snackbar = inject(MatSnackBar);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const authState = inject(AuthState);

  try {
    const result = await firstValueFrom(auth.socialCallback.getToken(state.request, {
      isNewUser: state.request.authType === 'signup',
      returnUrl: state[RETURN_URL_KEY]
    }))
      // TODO: THIS CATCH CHAIN IS TEMPORARY AND SHOULD BE REMOVED
      .catch(() => ({
        email: 'test@gmail.com',
        firstName: 'test',
        lastName: 'test',
      } as SocialUserNotInDB))

    console.debug(authState.user$());

    // We got back a token and a user
    if ('token' in result) {
      return false;
    }
    // user has not signed up yet. take his choice of role and sign him up
    else {
      authState.partialSocialSignIn$.set(result);

      const comp = await import('./social-callback.dialog')
        .then(m => m.SociallCallbackDialogComponent);

      const dialogRef = dialog.open(comp, {
        closeOnNavigation: true,
        disableClose: true
      });

      await firstValueFrom<Role>(dialogRef.afterClosed())
    }
  }
  catch (e) {
    snackbar.openFromComponent(SnackbarComponent, ErrorSnackbarDefaults);
    router.navigateByUrl('/account/sign-in');
  }

  return true;
}
