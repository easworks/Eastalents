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
      loadComponent: () => import('./dashboard/dashboard.page').then(m => m.EmployerDashboardComponent)
    },
    {
      path: 'spoc',
      pathMatch: 'full',
      loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent)
    },
    {
      path: 'general-info',
      pathMatch: 'full',
      loadComponent: () => import('./general-information/general-info.component').then(m => m.EmployerGeneralInfoComponent)
    },
    {
      path: 'hire-talent',
      pathMatch: 'full',
      loadComponent: () => import('./hire-talent/hire-talent.component').then(m => m.HireTalentComponent)
    },
    {
      path: 'my-teammates',
      pathMatch: 'full',
      loadComponent: () => import('./my-teammates/my-teammates.components').then(m => m.MyTeammatesComponent)
    },
    {
      path: 'cost-calculator',
      pathMatch: 'full',
      loadComponent: () => import('./cost-calculator/cost-calculator.component').then(m => m.CostCalculatorComponent)
    },
    {
      path: 'my-account',
      pathMatch: 'full',
      loadComponent: () => import('./my-account/my-account.component').then(m => m.MyAccountComponent)
    },
    {
      path: 'profile',
      pathMatch: 'full',
      redirectTo: 'profile'
    }
  ]
};
