import { Route } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';

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
