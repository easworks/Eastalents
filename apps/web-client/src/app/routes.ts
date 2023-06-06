import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell';
import { ACCOUNT_ROUTE } from '../account/routes';
import { FREELANCER_ROUTE } from '../freelancer/routes';


export const routes: Routes = [
  ACCOUNT_ROUTE,
  FREELANCER_ROUTE,
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];
