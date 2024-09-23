import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { AUTH_READY } from '@easworks/app-shell/services/auth.ready';
import { DOMAIN_DATA_READY } from '@easworks/app-shell/services/domain-data.ready';
import { ACCOUNT_ROUTES } from '../account/routes';
import { ADMIN_ROUTES } from '../admin/routes';
import { CLIENT_ROUTES } from '../client/routes';
import { PUBLIC_ROUTES } from '../public/routes';
import { TALENT_ROUTES } from '../talent/routes';

export const routes: Routes = [
  ...ACCOUNT_ROUTES,
  ADMIN_ROUTES,
  ...TALENT_ROUTES,
  ...CLIENT_ROUTES,
  // JOB_POST_ROUTE,
  // MESSAGES_ROUTE,
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
    const authReady = inject(AUTH_READY);
    const domainDataRady = inject(DOMAIN_DATA_READY);

    await authReady;
    await domainDataRady;
  });
});
