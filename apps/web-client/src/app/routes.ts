import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell';
import { ACCOUNT_ROUTES } from '../account/routes';


export const routes: Routes = [
  ACCOUNT_ROUTES,
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];