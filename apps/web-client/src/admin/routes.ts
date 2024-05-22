import { Route } from '@angular/router';

export const ADMIN_ROUTES: Route =
{
  path: 'admin',
  children: [
    {
      path: 'dashboard',
      pathMatch: 'full',
      loadComponent: () => import('./dashboard/admin-dashboard.page')
        .then(m => m.AdminDashboardPageComponent)
    },
    {
      path: 'software-products',
      pathMatch: 'full',
      loadComponent: () => import('./software-products/software-products.page')
        .then(m => m.SoftwareProductsPageComponent)
    },
    {
      path: 'tech-skills',
      pathMatch: 'full',
      loadComponent: () => import('./tech-skills/tech-skills.page')
        .then(m => m.TechSkillsPageComponent)
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard',
    }
  ]
};