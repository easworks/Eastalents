import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found.page';
import { ACCOUNT_ROUTE } from '../account/routes';
import { EMPLOYER_ROUTE } from '../employer/routes';
import { FREELANCER_ROUTE } from '../freelancer/routes';
import { PUBLIC_ROUTES } from '../public/routes';


export const routes: Routes = [
  ACCOUNT_ROUTE,
  FREELANCER_ROUTE,
  EMPLOYER_ROUTE,
  ...PUBLIC_ROUTES,
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];
