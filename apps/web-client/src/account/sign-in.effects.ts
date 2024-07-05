import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarComponent, SuccessSnackbarDefaults } from '@easworks/app-shell/notification/snackbar';
import { authActions, authFeature } from '@easworks/app-shell/state/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

const noRedirects = [
  '/account/sign-in',
  '/register',
  '/account/social'
] as const;

export const signInEffects = {
  afterSignIn: createEffect(
    () => {
      const actions$ = inject(Actions);
      const router = inject(Router);
      const store = inject(Store);
      const snackbar = inject(MatSnackBar);

      const user$ = store.selectSignal(authFeature.guaranteedUser);

      return actions$.pipe(
        ofType(authActions.signIn),
        map(({ payload }) => {
          snackbar.openFromComponent(SnackbarComponent, SuccessSnackbarDefaults);

          const role = user$().role;
          const isNew = user$().isNew;
          const { returnUrl } = payload;

          if (isNew) {
            if (role === 'freelancer') {
              router.navigateByUrl('/freelancer/profile/edit?new');
            }
            else if (role === 'employer') {
              router.navigateByUrl('/employer/profile/edit?new');
            }
          }
          else if (returnUrl && noRedirects.every(r => !returnUrl.startsWith(r))) {
            router.navigateByUrl(returnUrl);
          } else {
            if (role === 'freelancer')
              router.navigateByUrl('/freelancer');
            else if (role === 'employer')
              router.navigateByUrl('/employer');
          }
        })
      );
    },
    { functional: true, dispatch: false }
  ),

  afterSignOut: createEffect(
    () => {
      const actions$ = inject(Actions);
      const router = inject(Router);

      return actions$.pipe(
        ofType(authActions.signOut),
        map(() => {
          const url = new URL(window.location.href);
          const path = url.pathname;
          if (noRedirects.some(p => path.startsWith(p)))
            return;
          router.navigateByUrl('/');
        })
      );
    },
    { functional: true, dispatch: false }
  ),
} as const;