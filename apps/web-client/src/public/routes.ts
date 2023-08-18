import { ActivatedRouteSnapshot, Routes } from '@angular/router';
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
    path: 'software/:software',
    pathMatch: 'full',
    loadComponent: () => import('./role-software/role-software.page').then(m => m.RoleSoftwarePageComponent)
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
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
];
