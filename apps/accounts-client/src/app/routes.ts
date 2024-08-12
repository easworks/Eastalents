import { inject } from '@angular/core';
import { CanMatchFn, Route, Router } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { AuthGuardFn } from '@easworks/app-shell/services/auth.guard';
import { AUTH_READY } from '@easworks/app-shell/services/auth.ready';
import { authActions, authFeature } from '@easworks/app-shell/state/auth';
import { Store } from '@ngrx/store';
import { oauthAuthorizeCallback } from '../account/oauth-authorize-callback';
import { oauthCodeCallback } from '../account/oauth-code-callback';

// TODO: add this to signup routes
const redirectUser: CanMatchFn = async () => {
  const router = inject(Router);

  const info = router.getCurrentNavigation()?.extras.info as any;
  if (info && info.source === authActions.signOut.type)
    return true;

  const authReady = inject(AUTH_READY);
  const store = inject(Store);

  await authReady;

  const user = store.selectSignal(authFeature.selectUser)();

  if (user) {
    return router.createUrlTree(['/sign-in/success']);
  }

  return true;
};


export const routes: Route[] = [
  {
    path: 'sign-in',
    pathMatch: 'full',
    canMatch: [redirectUser],
    loadComponent: () => import('../account/sign-in/sign-in.page')
      .then(m => m.SignInPageComponent),
    data: {
      minimalUi: true
    }
  },
  {
    path: 'sign-up',
    pathMatch: 'full',
    loadComponent: () => import('../account/sign-up/account-type-choice/sign-up-account-type-choice.page')
      .then(m => m.SignUpAccountTypeChoicePageComponent)
  },
  {
    path: 'sign-up',
    canMatch: [redirectUser],
    loadComponent: () => import('../account/sign-up/sign-up.page')
      .then(m => m.SignUpPageComponent),
    data: {
      minimalUi: true
    },
    children: [
      {
        path: 'employer',
        loadComponent: () => import('../account/sign-up/employer/employer-sign-up-form.component')
          .then(m => m.EmployerSignUpFormComponent),
      },
      {
        path: 'talent',
        loadComponent: () => import('../account/sign-up/talent/talent-sign-up-form.component')
          .then(m => m.TalentSignUpFormComponent),
      },
    ]
  },
  {
    path: 'sign-in/success',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    loadComponent: () => import('../account/sign-in/success/sign-in-success.page')
      .then(m => m.SignInSuccessPageComponent),
    data: {
      minimalUi: true
    }
  },
  {
    path: 'oauth/authorize',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    canActivate: [oauthAuthorizeCallback],
    component: NotFoundPageComponent,
    data: {
      minimalUi: true
    }
  },
  {
    path: 'oauth/callback',
    pathMatch: 'full',
    canActivate: [oauthCodeCallback],
    component: NotFoundPageComponent,
    data: {
      minimalUi: true
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in'
  },
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];


// wait for auth to be ready on navigation
routes.forEach(route => {
  route.canMatch ||= [];
  route.canMatch.splice(0, 0, async () => {
    const authReady = inject(AUTH_READY);

    await authReady;
  });
});