import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found.page';
import { AuthService } from '@easworks/app-shell/services/auth';
import { ACCOUNT_ROUTE } from '../account/routes';
import { EMPLOYER_ROUTE } from '../employer/routes';
import { FREELANCER_ROUTE } from '../freelancer/routes';
import { MESSAGES_ROUTE } from '../messages/routes';
import { PUBLIC_ROUTES } from '../public/routes';

export const routes: Routes = [
  ACCOUNT_ROUTE,
  FREELANCER_ROUTE,
  EMPLOYER_ROUTE,
  MESSAGES_ROUTE,
  ...PUBLIC_ROUTES,
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];

// wait for auth to be ready on navigation
routes.forEach(route => {
  route.canMatch ||= [];
  route.canMatch.splice(0, 0, async () => {
    const auth = inject(AuthService);

    await auth.ready;
  });
});
