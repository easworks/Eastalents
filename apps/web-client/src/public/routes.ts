import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { HelpCenterService } from '@easworks/app-shell/services/help';
import { DomainState } from '@easworks/app-shell/state/domains';
import { toPromise } from '@easworks/app-shell/utilities/to-promise';
import { COMPANY_TYPE_DATA } from './company-type/data';
import { GENERIC_ROLE_DATA } from './generic-role/data';
import { SERVICE_TYPE_DATA } from './service-type/data';
import { USE_CASE_DATA } from './use-cases/data';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'for-employers',
    pathMatch: 'full',
    loadComponent: () => import('./for-employers/for-employers.page').then(m => m.ForEmployersPageComponent),
    resolve: {
      help: () => {
        const hcs = inject(HelpCenterService);
        return hcs.getGroups('employer', true);
      }
    }
  },
  {
    path: 'for-freelancer',
    pathMatch: 'full',
    loadComponent: () => import('./for-freelancer/for-freelancer.page').then(m => m.ForFreelancerPageComponent),
    resolve: {
      help: async () => {
        const hcs = inject(HelpCenterService);
        return hcs.getGroups('freelancer', true);
      }
    }
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
    loadComponent: () => import('./roles/roles.page').then(m => m.RolesPageComponent),
    resolve: {
      domain: async (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('domain');
        if (!key)
          throw new Error('invalid operation');

        return await getDomain(inject(DomainState), key);
      },
      role: async (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('domain');
        if (!key)
          throw new Error('invalid operation');

        const domain = await getDomain(inject(DomainState), key);

        const roleInput = route.paramMap.get('role');
        if (!roleInput)
          throw new Error('invalid operation');

        const found = domain.modules.some(m => m.roles.includes(roleInput));

        if (!found)
          throw new Error(`role '${roleInput}' not found in domain '${domain.key}'`);

        return roleInput;
      }
    }
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

        return await getDomain(inject(DomainState), key);
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
    path: 'help-center/:category/:group',
    pathMatch: 'full',
    loadComponent: () => import('./help-center/help-center-group.page').then(m => m.HelpCenterGroupPageComponent),
    resolve: {
      content: async (route: ActivatedRouteSnapshot) => {
        const router = inject(Router);
        const hsc = inject(HelpCenterService);

        const category = route.paramMap.get('category');
        if (!category)
          throw new Error('invalid operation');
        const group = route.paramMap.get('group');
        if (!group)
          throw new Error('invalid operation');

        const categories = await hsc.getCategories();

        const foundCategory = categories.find(c => c.slug === category);
        if (!foundCategory) {
          router.navigateByUrl(`/error-404`, { skipLocationChange: true });
          throw new Error('not found');
        }

        const all = await hsc.getGroups(category);

        const foundGroup = all.find(g => g.slug === group);
        if (!foundGroup) {
          router.navigateByUrl(`/error-404`, { skipLocationChange: true });
          throw new Error('not found');
        }

        await hsc.hydrateGroup(category, foundGroup);

        return {
          category: foundCategory,
          group: foundGroup
        };
      }
    }
  },
  {
    path: 'help-center',
    pathMatch: 'full',
    loadComponent: () => import('./help-center/help-center.page').then(m => m.HelpCenterPageComponent),
    resolve: {
      freelancer: () => inject(HelpCenterService).getGroups('freelancer'),
      employer: () => inject(HelpCenterService).getGroups('employer')
    }
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
    path: 'service-type/:ServiceType',
    pathMatch: 'full',
    loadComponent: () => import('./service-type/service-type.page').then(m => m.ServiceTypePageComponent),
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      ServiceType: (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('ServiceType');
        if (!key || !(key in SERVICE_TYPE_DATA))
          throw new Error('invalid operation');

        return SERVICE_TYPE_DATA[key];
      }
    }
  },

  {
    path: 'generic-role/:GenericRole',
    pathMatch: 'full',
    loadComponent: () => import('./generic-role/generic-role.page').then(m => m.GenericRolePageComponent),
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      GenericRole: (route: ActivatedRouteSnapshot) => {
        const key = route.paramMap.get('GenericRole');
        if (!key || !(key in GENERIC_ROLE_DATA))
          throw new Error('invalid operation');

        return GENERIC_ROLE_DATA[key];
      }
    }
  },
  {
    path: 'landing',
    pathMatch: 'full',
    loadComponent: () => import('./landing/landing.page').then(m => m.LandingPageComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
];

async function getDomain(state: DomainState, key: string) {
  const map$ = inject(DomainState).domains.map$;
  await toPromise(map$, m => m.size > 0);

  const domain = map$().get(key);
  if (!domain)
    throw new Error('invalid operation');
  return domain;
}
