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
      path: 'eas-role',
      pathMatch: 'full',
      loadComponent: () => import('./eas-role.page')
        .then(m => m.EasRoleComponent)
    }
  ]
};