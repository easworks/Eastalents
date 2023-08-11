import { Route } from '@angular/router';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell/services/auth';

export const EMPLOYER_ROUTE: Route = {
  path: 'employer',
  canMatch: [AuthGuard.asFunction],
  data: {
    auth: AUTH_GUARD_CHECKS.isInRole('employer')
  },
  children: [
    {
      path: 'dashboard',
      pathMatch: 'full',
      loadComponent: () => import('./dashboard.page').then(m => m.EmployerDashboardComponent)
    },
    {
      path: 'profile/edit',
      pathMatch: 'full',
      loadComponent: () => import('./profile-edit.page').then(m => m.EmployerProfileEditPageComponent)
    },
    {
      path: 'job-post/create',
      pathMatch: 'full',
      loadComponent: () => import('./job-post/create-job-post.page').then(m => m.CreateJobPostPageComponent)
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'profile'
    }
  ]
};
