import { Routes } from '@angular/router';

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
    path: 'roles',
    pathMatch: 'full',
    loadComponent: () => import('./roles/roles.page').then(m => m.RolesPageComponent)
  },
  {
    path: 'role-software',
    pathMatch: 'full',
    loadComponent: () => import('./role-software/role-software.page').then(m => m.RoleSoftwarePageComponent)
  },
  {
    path: 'use-cases',
    pathMatch: 'full',
    loadComponent: () => import('./use-cases/use-cases.page').then(m => m.UseCasesPageComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
];
