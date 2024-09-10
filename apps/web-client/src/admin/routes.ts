import { Route } from '@angular/router';

export const ADMIN_ROUTES: Route =
{
  path: 'admin',
  loadComponent: () => import('./admin-page/admin.page')
    .then(m => m.AdminPageComponent),
  children: [
    {
      path: 'dashboard',
      pathMatch: 'full',
      loadComponent: () => import('./dashboard/admin-dashboard.page')
        .then(m => m.AdminDashboardPageComponent)
    },
    {
      path: 'domains',
      pathMatch: 'full',
      loadComponent: () => import('./domains/page/domains.page')
        .then(m => m.DomainsPageComponent)
    },
    {
      path: 'software-products',
      pathMatch: 'full',
      loadComponent: () => import('./software-products/page/software-products.page')
        .then(m => m.SoftwareProductsPageComponent)
    },
    {
      path: 'tech-skills',
      pathMatch: 'full',
      loadComponent: () => import('./tech-skills/page/tech-skills.page')
        .then(m => m.TechSkillsPageComponent)
    },
    {
      path: 'tech-groups',
      pathMatch: 'full',
      loadComponent: () => import('./tech-groups/page/tech-groups.page')
        .then(m => m.TechGroupsPageComponent)
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard',
    }
  ]
};