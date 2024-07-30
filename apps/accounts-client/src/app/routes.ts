import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { AUTH_READY } from '@easworks/app-shell/services/auth.ready';

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