import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { HelpCategory, HelpCenterService } from '@easworks/app-shell/services/help';
import { firstValueFrom } from 'rxjs';

export const HELP_CENTER_ROUTES: Routes = [
  {
    path: 'help-center',
    loadComponent: () => import('./help-center.page').then(m => m.HelpCenterPageComponent),
    resolve: {
      categories: async () => {
        const service = inject(HelpCenterService);
        const all = await service.getCategories();
        return all;
      }
    },
    children: [
      {
        path: ':category',
        loadComponent: () => import('./category.page').then(m => m.HelpCenterCategoryPageComponent),
        resolve: {
          groups: async (route: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const service = inject(HelpCenterService);

            const category = ensureParameter('category', route);
            const categories: HelpCategory[] = route.parent?.data['categories'];

            const foundCategory = categories.find(c => c.slug === category);
            if (!foundCategory) {
              router.navigateByUrl(`/error-404`, { skipLocationChange: true });
              throw new Error('not found');
            }

            const groups = await service.getGroups(category);

            return groups;
          }
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'freelancer'
      }
    ]
  },
  {
    path: 'help-center/:category/:group',
    pathMatch: 'full',
    loadComponent: () => import('./group.page')
      .then(m => m.HelpCenterGroupPageComponent),
    resolve: {
      content: async (route: ActivatedRouteSnapshot) => {
        const router = inject(Router);
        const service = inject(HelpCenterService);

        const catKey = ensureParameter('category', route);
        const gKey = ensureParameter('group', route);

        const categories = await firstValueFrom(service.getCategories());

        const category = categories.find(c => c.slug === catKey);
        if (!category) {
          router.navigateByUrl(`/error-404`, { skipLocationChange: true });
          throw new Error('not found');
        }

        category.groups = await firstValueFrom(service.getGroups(catKey));

        const group = category.groups.find(g => g.slug === gKey);
        if (!group) {
          router.navigateByUrl(`/error-404`, { skipLocationChange: true });
          throw new Error('not found');
        }

        await service.hydrateGroup(category.slug, group);

        return {
          category,
          group
        };
      }
    }
  },
];

function ensureParameter(key: string, route: ActivatedRouteSnapshot) {
  const value = route.paramMap.get(key);
  if (!value)
    throw new Error('invalid operation');
  return value;
}
