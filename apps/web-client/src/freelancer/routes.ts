import { Route } from '@angular/router';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell/services/auth';

export const FREELANCER_ROUTES: Route[] = [
  {
    path: 'dashboard',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
    },
    loadComponent: () => import('./dashboard.page').then(m => m.FreelancerDashboardComponent)
  },
  {
    path: 'freelancer',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.isInRole('freelancer')
    },
    children: [
      {
        path: 'profile',
        pathMatch: 'full',
        loadComponent: () => import('./profile.page').then(m => m.FreelancerProfilePageComponent)
      },
      {
        path: 'profile/edit',
        pathMatch: 'full',
        loadComponent: () => import('./profile-edit.page').then(m => m.FreelancerProfileEditPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      }
    ]
  }
];
