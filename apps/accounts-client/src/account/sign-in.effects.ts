import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { authActions } from '@easworks/app-shell/state/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';

export const signInEffects = {
  afterSignIn: createEffect(() => {
    const actions$ = inject(Actions);
    const snackbar = inject(MatSnackBar);
    const router = inject(Router);

    return actions$
      .pipe(
        ofType(authActions.signIn),
        switchMap(async ({ payload }) => {
          if (payload.returnUrl) {
            router.navigateByUrl(payload.returnUrl);
          }
          SnackbarComponent.forSuccess(snackbar);
        })
      );

  }, { functional: true, dispatch: false })
};