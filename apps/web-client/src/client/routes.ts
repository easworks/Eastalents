import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { ClientApi } from '@easworks/app-shell/api/client.api';
import { AuthGuardFn } from '@easworks/app-shell/services/auth.guard';
import { AUTH_CHECKS } from '@easworks/app-shell/state/auth';

export const CLIENT_ROUTES: Route[] = [
  {
    path: 'hiring-overview',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./dashboard2/dashboard.page').then(m => m.DashboardComponent)
  },
  {
    path: 'client/general-info',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./general-information/general-info.component').then(m => m.EmployerGeneralInfoComponent)
  },
  {
    path: 'client/hire-talents',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./hire-talent/hire-talent.component').then(m => m.HireTalentComponent)
  },
  {
    path: 'client/my-teammates',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./my-teammates/my-teammates.components').then(m => m.MyTeammatesComponent)
  },
  {
    path: 'client/budget-planner',
    pathMatch: 'full',
    loadComponent: () => import('./cost-calculator/cost-calculator.component').then(m => m.CostCalculatorComponent),
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
  },
  {
    path: 'support-center',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  {
    path: 'customer-success-manager',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent)
  },
  {
    path: 'account-setting',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./my-profile/my-account.component').then(m => m.MyAccountComponent)
  },
  {
    path: 'client/profile/edit',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    loadComponent: () => import('./profile/edit/profile-edit.page')
      .then(m => m.ClientProfileEditPageComponent),
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    resolve: {
      profile: () => {
        const api = inject(ClientApi);
        return api.profile.get();
      }
    }
  },
  {
    path: 'account-setting',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('client')
    },
    loadComponent: () => import('./my-profile/my-account.component').then(m => m.MyAccountComponent)
  },
  // {
  //   path: 'help',
  //   pathMatch: 'full',
  //   canMatch: [AuthGuard.asFunction],
  //   data: {
  //     auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
  //   },
  //   loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent)
  // },
  // {
  //   path: 'employer',
  //   loadChildren: () => [
  //     
  //     {
  //       path: 'general-info',
  //       pathMatch: 'full',
  //       canMatch: [AuthGuard.asFunction],
  //       data: {
  //         auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
  //       },
  //       loadComponent: () => import('./general-information/general-info.component').then(m => m.EmployerGeneralInfoComponent)
  //     },
  //     {
  //       path: 'hire-talents',
  //       pathMatch: 'full',
  //       canMatch: [AuthGuard.asFunction],
  //       data: {
  //         auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
  //       },
  //       loadComponent: () => import('./hire-talent/hire-talent.component').then(m => m.HireTalentComponent)
  //     },
  //     {
  //       path: 'account',
  //       pathMatch: 'full',
  //       canMatch: [AuthGuard.asFunction],
  //       data: {
  //         auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
  //       },
  //       loadComponent: () => import('./my-profile/my-account.component').then(m => m.MyAccountComponent)
  //     },
  //     {
  //       path: 'my-teammates',
  //       pathMatch: 'full',
  //       canMatch: [AuthGuard.asFunction],
  //       data: {
  //         auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
  //       },
  //       loadComponent: () => import('./my-teammates/my-teammates.components').then(m => m.MyTeammatesComponent)
  //     },
  //     {
  //       path: 'spoc',
  //       pathMatch: 'full',
  //       canMatch: [AuthGuard.asFunction],
  //       data: {
  //         auth: AUTH_GUARD_CHECKS.hasPermissions(['role.employer'])
  //       },
  //       loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent
  //       )
  //     },
  //     {
  //       path: 'profile',
  //       pathMatch: 'full',
  //       loadComponent: () => import('./profile.page').then(m => m.EmployerProfilePageComponent),
  //       resolve: {
  //         profile: async () => {
  //           const api = inject(EmployerApi);
  //           const snackbar = inject(MatSnackBar);

  //           return api.profile.get()
  //             .catch(e => {
  //               snackbar.openFromComponent(SnackbarComponent, {
  //                 ...ErrorSnackbarDefaults,
  //                 data: { message: e.message }
  //               });
  //               throw e;
  //             });
  //         }
  //       }
  //     },
  //     {
  //       path: 'profile/edit',
  //       pathMatch: 'full',
  //       loadComponent: () => import('./profile-edit.page').then(m => m.EmployerProfileEditPageComponent)
  //     },
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'profile'
  //     }
  //   ]
  // }
];
