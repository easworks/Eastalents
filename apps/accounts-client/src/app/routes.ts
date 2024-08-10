import { inject } from '@angular/core';
import { CanMatchFn, Route, Router } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { AUTH_READY } from '@easworks/app-shell/services/auth.ready';
import { AuthGuardFn } from '@easworks/app-shell/services/auth.guard';
import { Store } from '@ngrx/store';
import { authFeature } from '@easworks/app-shell/state/auth';
import { oauthCallback } from '../account/oauth-callback';

// TODO: add this to signup routes
const redirectUser: CanMatchFn = () => {
  const store = inject(Store);
  const user = store.selectSignal(authFeature.selectUser)();


  if (user) {
    const router = inject(Router);
    return router.createUrlTree(['/sign-in']);
  }

  return true;
};


export const routes: Route[] = [
  {
    path: 'sign-in',
    pathMatch: 'full',
    loadComponent: () => import('../account/sign-in/sign-in.page')
      .then(m => m.SignInPageComponent),
    data: {
      minimalUi: true
    }
  },
  {
    path: 'oauth/authorize',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    canActivate: [oauthCallback],
    component: NotFoundPageComponent
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