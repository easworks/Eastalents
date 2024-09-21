import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { authActions } from '@easworks/app-shell/state/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';

export const signInEffects = {
  afterSignIn: createEffect(
    () => {
      const actions$ = inject(Actions);
      const router = inject(Router);
      const snackbar = inject(MatSnackBar);

      return actions$
        .pipe(
          ofType(authActions.signIn),
          switchMap(async ({ payload }) => {
            if (payload.returnUrl) {
              await router.navigateByUrl(payload.returnUrl);
            }
            else {
              await router.navigateByUrl('/');
            }
            SnackbarComponent.forSuccess(snackbar);
          })
        );
      // return actions$.pipe(
      //   ofType(authActions.signIn),
      //   map(({ payload }) => {
      //     snackbar.openFromComponent(SnackbarComponent, SuccessSnackbarDefaults);

      //     const role = user$().role;
      //     const isNew = user$().isNew;
      //     const { returnUrl } = payload;

      //     if (isNew) {
      //       if (role === 'freelancer') {
      //         router.navigateByUrl('/freelancer/profile/edit?new');
      //       }
      //       else if (role === 'client') {
      //         router.navigateByUrl('/client/profile/edit?new');
      //       }
      //     }
      //     else if (returnUrl && noRedirects.every(r => !returnUrl.startsWith(r))) {
      //       router.navigateByUrl(returnUrl);
      //     } else {
      //       if (role === 'freelancer')
      //         router.navigateByUrl('/freelancer');
      //       else if (role === 'client')
      //         router.navigateByUrl('/client');
      //     }
      //   })
      // );
    },
    { functional: true, dispatch: false }
  ),
} as const;