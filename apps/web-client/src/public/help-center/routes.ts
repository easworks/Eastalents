import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { HelpCategory, HelpCenterService } from '@easworks/app-shell/services/help';

export const HELP_CENTER_ROUTES: Routes = [
  // {
  //   path: 'help-center/:category/:group',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./help-center-group.page').then(m => m.HelpCenterGroupPageComponent),
  //   resolve: {
  //     content: async (route: ActivatedRouteSnapshot) => {
  //       const router = inject(Router);
  //       const hsc = inject(HelpCenterService);

  //       const category = route.paramMap.get('category');
  //       if (!category)
  //         throw new Error('invalid operation');
  //       const group = route.paramMap.get('group');
  //       if (!group)
  //         throw new Error('invalid operation');

  //       const categories = await hsc.getCategories();

  //       const foundCategory = categories.find(c => c.slug === category);
  //       if (!foundCategory) {
  //         router.navigateByUrl(`/error-404`, { skipLocationChange: true });
  //         throw new Error('not found');
  //       }

  //       const all = await hsc.getGroups(category);

  //       const foundGroup = all.find(g => g.slug === group);
  //       if (!foundGroup) {
  //         router.navigateByUrl(`/error-404`, { skipLocationChange: true });
  //         throw new Error('not found');
  //       }

  //       await hsc.hydrateGroup(category, foundGroup);

  //       return {
  //         category: foundCategory,
  //         group: foundGroup
  //       };
  //     }
  //   }
  // },
  // {
  //   path: 'help-center',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./help-center.page').then(m => m.HelpCenterPageComponent),
  //   resolve: {
  //     freelancer: () => inject(HelpCenterService).getGroups('freelancer'),
  //     employer: () => inject(HelpCenterService).getGroups('employer')
  //   }
  // },
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

            const category = route.paramMap.get('category');
            if (!category)
              throw new Error('invalid operation');

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
  }
];
