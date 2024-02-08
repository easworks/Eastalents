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
    }
  ]
};