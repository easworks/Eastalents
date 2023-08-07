import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'company-type',
    pathMatch: 'full',
    loadComponent: () => import('./company-type/company-type.page').then(m => m.CompanyTypePageComponent)
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
    path: 'role-page',
    pathMatch: 'full',
    loadComponent: () => import('./roles/roles-page.page').then(m => m.RolesPageComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
];
