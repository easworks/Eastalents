import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/router';
import { EmployerApi } from '@easworks/app-shell/api/employer.api';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell/services/auth';

export const EMPLOYER_ROUTE: Route = {
  path: 'employer',
  canMatch: [AuthGuard.asFunction],
  data: {
    auth: AUTH_GUARD_CHECKS.isInRole('employer')
  },
  loadChildren: () => [
    {
      path: 'dashboard',
      pathMatch: 'full',
      loadComponent: () => import('./dashboard.page').then(m => m.EmployerDashboardComponent)
    },
    {
      path: 'profile',
      pathMatch: 'full',
      loadComponent: () => import('./profile.page').then(m => m.EmployerProfilePageComponent),
      resolve: {
        profile: async () => {
          const api = inject(EmployerApi);
          const snackbar = inject(MatSnackBar);

          return api.profile.get()
            .catch(e => {
              snackbar.openFromComponent(SnackbarComponent, {
                ...ErrorSnackbarDefaults,
                data: { message: e.message }
              });
              throw e;
            });
        }
      }
    },
    {
      path: 'profile/edit',
      pathMatch: 'full',
      loadComponent: () => import('./profile-edit.page').then(m => m.EmployerProfileEditPageComponent)
    },
    {
      path: 'job-post/create',
      pathMatch: 'full',
      loadComponent: () => import('./job-post/create/create-job-post.page').then(m => m.CreateJobPostPageComponent)
    },
    {
      path: 'job-post/view',
      pathMatch: 'full',
      loadComponent: () => import('./job-post/view/view-job-post.page').then(m => m.ViewJobPostPageComponent),
      resolve: {
        jobPost: async () => {
          const data = import('./job-post/view/mock-job-post')
            .then(m => m.mockJobPost);
          return data;
        }
      }
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'profile'
    }
  ]
};
