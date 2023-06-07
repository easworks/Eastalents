import { Route } from '@angular/router';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell';

export const FREELANCER_ROUTE: Route = {
  path: 'freelancer',
  canMatch: [AuthGuard.asFunction],
  data: {
    auth: AUTH_GUARD_CHECKS.isInRole('freelancer')
  },
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./dashboard.page').then(m => m.FreelancerDashboardComponent)
    },
    {
      path: 'profile',
      loadComponent: () => import('./profile.page').then(m => m.FreelancerProfilePageComponent)
    }
  ]
}