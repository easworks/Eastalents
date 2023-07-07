import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'company-type',
    pathMatch: 'full',
    loadComponent: () => import('./company-type.page').then(m => m.CompanyTypePageComponent)
  }
];