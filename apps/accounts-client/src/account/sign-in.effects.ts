import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { authActions } from '@easworks/app-shell/state/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';

const noRedirects = [
  '/sign-in',
  '/register',
  '/social'
] as const;

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

  }, { functional: true, dispatch: false }),

  afterSignOut: createEffect(
    () => {
      const actions$ = inject(Actions);
      const router = inject(Router);

      return actions$.pipe(
        ofType(authActions.signOut),
        switchMap(async () => {
          const url = new URL(window.location.href);
          const path = url.pathname;
          if (noRedirects.some(p => path.startsWith(p)))
            return;
          await router.navigateByUrl('/');
        })
      );
    },
    { functional: true, dispatch: false }
  ),
};