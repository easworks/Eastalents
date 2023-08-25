import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { DomainState } from '@easworks/app-shell/state/domains';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { USE_CASE_DATA } from './use-cases/data';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'for-employers',
    pathMatch: 'full',
    loadComponent: () => import('./for-employers/for-employers.page').then(m => m.ForEmployersPageComponent)
  },
  {
    path: 'for-freelancer',
    pathMatch: 'full',
    loadComponent: () => import('./for-freelancer/for-freelancer.page').then(m => m.ForFreelancerPageComponent)
  },
  {
    path: 'easworks-talent',
    pathMatch: 'full',
    loadComponent: () => import('./easworks-talent/easworks-talent.page').then(m => m.EasworksTalentPageComponent)
  },
  {
    path: 'why-easworks',
    pathMatch: 'full',
    loadComponent: () => import('./why-easworks/why-easworks.page').then(m => m.WhyEasworksPageComponent)
  },
  {
    path: 'roles/:domain/:role',
    pathMatch: 'full',
    loadComponent: () => import('./roles/roles.page').then(m => m.RolesPageComponent)
  },
  {
    path: 'software/:domain/:software',
    pathMatch: 'full',
    loadComponent: () => import('./software/software.page').then(m => m.SoftwarePageComponent),
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      domain: async (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('domain');
        if (!key)
          throw new Error('invalid operation');

        const map$ = inject(DomainState).domains.map$;
        await toPromise(map$, m => m.size > 0);

        const domain = map$().get(key);
        if (!domain)
          throw new Error('invalid operation');
        return domain;
      },
      software: async (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('software');
        if (!key)
          throw new Error('invalid operation');

        const map$ = inject(DomainState).products.map$;
        await toPromise(map$, m => m.size > 0);

        const software = map$().get(key);
        if (!software)
          throw new Error('invalid operation');
        return software;
      }
    }
  },
  {
    path: 'use-cases/:useCaseKey',
    pathMatch: 'full',
    loadComponent: () => import('./use-cases/use-cases.page').then(m => m.UseCasesPageComponent),
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      useCase: (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('useCaseKey');
        if (!key || !(key in USE_CASE_DATA))
          throw new Error('invalid operation');

        return USE_CASE_DATA[key];
      }
    }
  },
  {
    path: 'help-center',
    pathMatch: 'full',
    loadComponent: () => import('./help-center/help-center.page').then(m => m.HelpCenterPageComponent)
  },
  {
    path: 'help-center-view',
    pathMatch: 'full',
    loadComponent: () => import('./help-center/help-center-view.page').then(m => m.HelpCenterViewPageComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
];
