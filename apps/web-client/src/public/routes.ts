import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { DomainState } from '@easworks/app-shell/state/domains';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { USE_CASE_DATA } from './use-cases/data';
import { COMPANY_TYPE_DATA } from './company-type/data';

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
    path: 'about-us',
    pathMatch: 'full',
    loadComponent: () => import('./about-us/about-us.page').then(m => m.AboutUsPageComponent)
  },
  {
    path: 'contact-us',
    pathMatch: 'full',
    loadComponent: () => import('./contact-us/contact-us.page').then(m => m.ContactUsPageComponent)
  },
  {
    path: 'code-of-conduct',
    pathMatch: 'full',
    loadComponent: () => import('./code-of-conduct/code-of-conduct.page').then(m => m.CodeOfConductPageComponent),
    resolve: {
      content: () => fetch('/assets/pages/code-of-conduct/content.md')
        .then(r => r.text())
    }
  },
  {
    path: 'cookie-policy',
    pathMatch: 'full',
    loadComponent: () => import('./cookie-policy/cookie-policy.page').then(m => m.CookiePolicyPageComponent),
    resolve: {
      content: () => fetch('/assets/pages/cookie-policy/content.md')
        .then(r => r.text())
    }
  },
  {
    path: 'data-processing-agreement',
    pathMatch: 'full',
    loadComponent: () => import('./data-processing-agreement/data-processing-agreement.page').then(m => m.DataProcessingAgreementPageComponent),
    resolve: {
      content: () => fetch('/assets/pages/data-processing-agreement/content.md')
        .then(r => r.text())
    }
  },
  {
    path: 'privacy-policy',
    pathMatch: 'full',
    loadComponent: () => import('./privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPageComponent),
    resolve: {
      content: () => fetch('/assets/pages/privacy-policy/content.md')
        .then(r => r.text())
    }
  },
  {
    path: 'terms-of-use',
    pathMatch: 'full',
    loadComponent: () => import('./terms-of-use/terms-of-use.page').then(m => m.TermsOfUsePageComponent),
    resolve: {
      content: () => fetch('/assets/pages/terms-of-use/content.md')
        .then(r => r.text())
    }
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
  {
    path: 'company-type/:CompanyType',
    pathMatch: 'full',
    loadComponent: () => import('./company-type/company-type.page').then(m => m.CompanyTypePageComponent),
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      CompanyType: (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('CompanyType');
        if (!key || !(key in COMPANY_TYPE_DATA))
          throw new Error('invalid operation');

        return COMPANY_TYPE_DATA[key];
      }
    }
  },
  {
    path: 'service-type',
    pathMatch: 'full',
    loadComponent: () => import('./service-type/service-type.page').then(m => m.ServiceTypePageComponent)
  },
];
