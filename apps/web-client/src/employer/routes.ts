import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/router';
import { EmployerApi } from '@easworks/app-shell/api/employer.api';
import { ErrorSnackbarDefaults, SnackbarComponent } from '@easworks/app-shell/notification/snackbar';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell/services/auth';

export const EMPLOYER_ROUTES: Route[] = [
  {
    path: 'dashboard',
    pathMatch: 'full',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
    },
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.EmployerDashboardComponent)
  },
  {
    path: 'spoc',
    pathMatch: 'full',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
    },
    loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent)
  },
  {
    path: 'employer',
    loadChildren: () => [
      {
        path: 'cost-calculator',
        pathMatch: 'full',
        loadComponent: () => import('./cost-calculator/cost-calculator.component').then(m => m.CostCalculatorComponent),
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['cost-calculator'])
        }
      },
      {
        path: 'general-info',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
        },
        loadComponent: () => import('./general-information/general-info.component').then(m => m.EmployerGeneralInfoComponent)
      },
      {
        path: 'hire-talents',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
        },
        loadComponent: () => import('./hire-talent/hire-talent.component').then(m => m.HireTalentComponent)
      },
      {
        path: 'account',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
        },
        loadComponent: () => import('./my-account/my-account.component').then(m => m.MyAccountComponent)
      },
      {
        path: 'my-teammates',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
        },
        loadComponent: () => import('./my-teammates/my-teammates.components').then(m => m.MyTeammatesComponent)
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
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      }
    ]
  }
];
