import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell';
import { ACCOUNT_ROUTE } from '../account/routes';
import { FREELANCER_ROUTE } from '../freelancer/routes';
import { ENTERPRISE_ROUTE } from '../enterprise/routes';
import { PUBLIC_ROUTES } from '../public/routes';


export const routes: Routes = [
  ACCOUNT_ROUTE,
  FREELANCER_ROUTE,
  ENTERPRISE_ROUTE,
  ...PUBLIC_ROUTES,
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];
