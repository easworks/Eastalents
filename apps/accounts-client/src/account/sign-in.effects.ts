import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { authActions } from '@easworks/app-shell/state/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';

export const signInEffects = {
  afterSignIn: createEffect(() => {
    const actions$ = inject(Actions);
    const snackbar = inject(MatSnackBar);
    const router = inject(Router);

    return actions$
      .pipe(
        ofType(authActions.signIn),
        switchMap(async ({ payload }) => {
          const returnUrl = payload.returnUrl || '/';
          await router.navigateByUrl(returnUrl);
          SnackbarComponent.forSuccess(snackbar);
        })
      );

  }, { functional: true, dispatch: false })
};