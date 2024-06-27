import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found.page';
import { AuthState } from '@easworks/app-shell/state/auth';
import { ACCOUNT_ROUTES } from '../account/routes';
import { ADMIN_ROUTES } from '../admin/routes';
import { EMPLOYER_ROUTE } from '../employer/routes';
import { TALENT_ROUTE } from '../freelancer/routes';
import { MESSAGES_ROUTE } from '../messages/routes';
import { PUBLIC_ROUTES } from '../public/routes';

export const routes: Routes = [
  ...ACCOUNT_ROUTES,
  ADMIN_ROUTES,
  TALENT_ROUTE,
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
    const auth = inject(AuthState);

    await auth.ready;
  });
});
