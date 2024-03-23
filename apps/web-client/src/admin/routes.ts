import { Route } from '@angular/router';

export const ADMIN_ROUTES: Route =
{
  path: 'admin',
  children: [
    {
      path: 'tech-skills',
      pathMatch: 'full',
      loadComponent: () => import('./tech-skills.page')
        .then(m => m.TechSkillsPageComponent)
    },
    {
      path: 'tech-groups',
      pathMatch: 'full',
      loadComponent: () => import('./tech-group.page')
        .then(m => m.TechGroupPageComponent)
    },
    {
      path: 'eas-roles',
      pathMatch: 'full',
      loadComponent: () => import('./eas-role.page')
        .then(m => m.EasRoleComponent)
    },
    {
      path: 'software-products',
      pathMatch: 'full',
      loadComponent: () => import('./software-product.page')
        .then(m => m.SoftwareProductPageComponent)
    },
    {
      path: 'domain-modules',
      pathMatch: 'full',
      loadComponent: () => import('./domain-module.page')
        .then(m => m.DomainModuleComponent)
    },
    {
      path: 'domains',
      pathMatch: 'full',
      loadComponent: () => import('./domains.page')
        .then(m => m.DomainsComponent)
    },
    {
      path: 'feature-product',
      pathMatch: 'full',
      loadComponent: () => import('./feature-product.page')
        .then(m => m.FeatureProductComponent)
    }
  ]
};