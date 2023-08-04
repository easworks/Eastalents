import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'company-type',
    pathMatch: 'full',
    loadComponent: () => import('./company-type.page').then(m => m.CompanyTypePageComponent)
  },
  {
    path: 'for-freelancer',
    pathMatch: 'full',
    loadComponent: () => import('./ForFreelancer/forfreelancer.page').then(m => m.ForFreelancerComponent)
  },
  {
    path: 'easworks-talent',
    pathMatch: 'full',
    loadComponent: () => import('./EasworksTalent/EasworksTalent.page').then(m => m.EasworksTalentComponent)
  },
  {
    path: 'why-easworks',
    pathMatch: 'full',
    loadComponent: () => import('./WhyEasworks/why-easworks.page').then(m => m.WhyeasworksComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./Home/home.page').then(m => m.HomePageComponent)
  },
];
