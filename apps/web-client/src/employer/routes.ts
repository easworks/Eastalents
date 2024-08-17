import { Route } from '@angular/router';
import { AuthGuardFn } from '@easworks/app-shell/services/auth.guard';
import { AUTH_CHECKS } from '@easworks/app-shell/state/auth';

export const EMPLOYER_ROUTES: Route[] = [
  {
    path: 'hiring-overview',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
    loadComponent: () => import('./dashboard2/dashboard.page').then(m => m.DashboardComponent)
  },
  {
    path: 'employer/general-info',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
    loadComponent: () => import('./general-information/general-info.component').then(m => m.EmployerGeneralInfoComponent)
  },
  {
    path: 'employer/hire-talents',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
    loadComponent: () => import('./hire-talent/hire-talent.component').then(m => m.HireTalentComponent)
  },
  {
    path: 'employer/my-teammates',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
    loadComponent: () => import('./my-teammates/my-teammates.components').then(m => m.MyTeammatesComponent)
  },
  {
    path: 'employer/budget-planner',
    pathMatch: 'full',
    loadComponent: () => import('./cost-calculator/cost-calculator.component').then(m => m.CostCalculatorComponent),
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
  },
  {
    path: 'support-center',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
    loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  {
    path: 'customer-success-manager',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
    },
    loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent)
  },
  {
    path: 'account-setting',
    pathMatch: 'full',
    canMatch: [AuthGuardFn],
    data: {
      auth: AUTH_CHECKS.hasRole('employer')
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
