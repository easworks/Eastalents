import { Route } from '@angular/router';

export const ENTERPRISE_ROUTE: Route = {
  path: 'enterprise',
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./dashboard.page').then(m => m.EnterpriseDashboardComponent)
    }
  ]
}