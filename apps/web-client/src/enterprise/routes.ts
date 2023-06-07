import { Route } from '@angular/router';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell';

export const ENTERPRISE_ROUTE: Route = {
  path: 'enterprise',
  canMatch: [AuthGuard.asFunction],
  data: {
    auth: AUTH_GUARD_CHECKS.isInRole('employer')
  },
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./dashboard.page').then(m => m.EnterpriseDashboardComponent)
    }
  ]
}