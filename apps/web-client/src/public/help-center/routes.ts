import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { HelpCategory, HelpCenterService } from '@easworks/app-shell/services/help';
import { map, switchMap } from 'rxjs';

export const HELP_CENTER_ROUTES: Routes = [
  {
    path: 'help-center',
    loadComponent: () => import('./help-center.page').then(m => m.HelpCenterPageComponent),
    resolve: {
      categories: () => {
        const service = inject(HelpCenterService);
        return service.getCategories();
      }
    },
    children: [
      {
        path: ':category',
        loadComponent: () => import('./category.page').then(m => m.HelpCenterCategoryPageComponent),
        resolve: {
          groups: (route: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const service = inject(HelpCenterService);

            const category = ensureParameter('category', route);
            const categories: HelpCategory[] = route.parent?.data['categories'];

            const foundCategory = categories.find(c => c.slug === category);
            if (!foundCategory) {
              router.navigateByUrl(`/error-404`, { skipLocationChange: true });
              throw new Error('not found');
            }

            return service.getGroups(category);
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
      content: (route: ActivatedRouteSnapshot) => {
        const router = inject(Router);
        const service = inject(HelpCenterService);

        const catKey = ensureParameter('category', route);
        const gKey = ensureParameter('group', route);

        return service.getCategories()
          .pipe(
            switchMap(categories => {
              const category = categories.find(c => c.slug === catKey);
              if (!category) {
                router.navigateByUrl(`/error-404`, { skipLocationChange: true });
                throw new Error('not found');
              }
              return service.getGroups(catKey)
                .pipe(map(groups => {
                  category.groups = groups;
                  return category;
                }));
            }),
            switchMap(category => {
              const group = category.groups.find(g => g.slug === gKey);
              if (!group) {
                router.navigateByUrl(`/error-404`, { skipLocationChange: true });
                throw new Error('not found');
              }

              return service.hydrateGroup(category.slug, group)
                .pipe(map(() => ({
                  category,
                  group
                })));
            })
          );
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
