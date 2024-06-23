import { Route } from '@angular/router';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell/services/auth';

export const JOB_POST_ROUTE: Route = {
  path: 'job-post',
  children: [
    {
      path: 'create',
      pathMatch: 'full',
      loadComponent: () => import('./create/create-job-post.page').then(m => m.CreateJobPostPageComponent),
      canMatch: [AuthGuard.asFunction],
      data: {
        auth: AUTH_GUARD_CHECKS.isInRole('employer'),
        mode: 'create'
      },
    },
    {
      path: 'edit',
      pathMatch: 'full',
      loadComponent: () => import('./create/create-job-post.page').then(m => m.CreateJobPostPageComponent),
      canMatch: [AuthGuard.asFunction],
      data: {
        auth: AUTH_GUARD_CHECKS.isInRole('employer'),
        mode: 'edit'
      },
      resolve: {
        jobPost: async () => {
          const data = import('./view/mock-job-post')
            .then(m => m.mockJobPost);
          return data;
        }
      }
    },
    {
      path: 'view',
      pathMatch: 'full',
      loadComponent: () => import('./view/view-job-post.page').then(m => m.ViewJobPostPageComponent),
      resolve: {
        jobPost: async () => {
          const data = import('./view/mock-job-post')
            .then(m => m.mockJobPost);
          return data;
        }
      }
    },
    {
      path: 'list',
      pathMatch: 'full',
      loadComponent: () => import('./list/list-job-post.page').then(m => m.ListJobPostPageComponent),
      resolve: {
        listJobPost: async () => {
          const data = import('./list/mock-job-post')
            .then(m => m.mockJobPost);
          return data;
        }
      }
    },
  ]
};