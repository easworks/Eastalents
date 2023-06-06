import { Route } from '@angular/router';

export const FREELANCER_ROUTE: Route = {
  path: 'freelancer',
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./dashboard.page').then(m => m.FreelancerDashboardComponent)
    }
  ]
}