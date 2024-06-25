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
      loadComponent: () => import('./dashboard/dashboard.page').then(m => m.EmployerDashboardComponent)
    },
    {
      path: 'myprofile',
      pathMatch: 'full',
      loadComponent: () => import('./my-profile/my-profile/my-profile.component').then(m => m.MyProfileComponent)
    },
    {
      path: 'mockjobs',
      pathMatch: 'full',
      loadComponent: () => import('./mock-jobs/mock-jobs.component').then(m => m.MockJobsComponent)
    },
    {
      path: 'myapplication',
      pathMatch: 'full',
      loadComponent: () => import('./my-applications/my-applications.component').then(m => m.MyApplicationsComponent)
    },
    {
      path: 'savedjobs',
      pathMatch: 'full',
      loadComponent: () => import('./mock-saved-job/mock-saved-job.component').then(m => m.MockSavedJobComponent)
    },
    {
      path: 'teilmixprofile',
      pathMatch: 'full',
      loadComponent: () => import('./teilmix-myprofile/telmix-myprofile.component').then(m => m.TelmixMyprofileComponent)
    },
    {
      path: 'genaivitting',
      pathMatch: 'full',
      loadComponent: () => import('./gen-ai-vitting/gen-ai-vatting.component').then(m => m.GenAiVattingComponent)
    },
    {
      path: 'contactus',
      pathMatch: 'full',
      loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent)
    },
    {
      path: 'spoc',
      pathMatch: 'full',
      loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent)
    },
    {
      path: 'myaccount',
      pathMatch: 'full',
      loadComponent: () => import('./my-account/my-account.component').then(m => m.MyAccountComponent)
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
