import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { AUTH_READY } from '@easworks/app-shell/services/auth.ready';
import { PageMetadata } from '@easworks/app-shell/services/seo';
import { AUTH_CHECKS, authActions, authFeature } from '@easworks/app-shell/state/auth';
import { Store } from '@ngrx/store';
import { HELP_CENTER_ROUTES } from './help-center/routes';
import { USE_CASES_ROUTE } from './use-cases/routes';

const redirectUser: CanMatchFn = (() => {
  const checks = {
    talent: AUTH_CHECKS.hasRole('talent'),
    client: AUTH_CHECKS.hasRole('client')
  };

  return async () => {
    const router = inject(Router);

    const renderHome = () => new RedirectCommand(
      router.createUrlTree(['/home']),
      { skipLocationChange: true }
    );

    const info = router.getCurrentNavigation()?.extras.info as any;
    if (info && info.source === authActions.signOut.type)
      return renderHome();

    const authReady = inject(AUTH_READY);
    const store = inject(Store);

    await authReady;

    const user = store.selectSignal(authFeature.selectUser)();

    if (user) {
      switch (true) {
        case checks.talent(user): return router.createUrlTree(['/dashboard']);
        case checks.client(user): return router.createUrlTree(['/hiring-overview']);
      }
    }

    return renderHome();
  };


})();


export const PUBLIC_ROUTES: Routes = [
  {
    path: 'home',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.page').then(m => m.HomePageComponent)
  },
  // {
  //   path: 'for-companies',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./for-companies/for-companies.page').then(m => m.ForCompaniesPageComponent),
  //   resolve: {
  //     help: () => {
  //       const hcs = inject(HelpCenterService);
  //       return hcs.getGroups('client', true);
  //     }
  //   }
  // },
  // {
  //   path: 'for-freelancer',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./for-freelancer/for-freelancer.page').then(m => m.ForFreelancerPageComponent),
  //   resolve: {
  //     help: async () => {
  //       const hcs = inject(HelpCenterService);
  //       return hcs.getGroups('freelancer', true);
  //     }
  //   }
  // },
  // {
  //   path: 'easworks-talent',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./easworks-talent/easworks-talent.page').then(m => m.EasworksTalentPageComponent)
  // },
  {
    path: 'why-easworks',
    pathMatch: 'full',
    loadComponent: () => import('./why-easworks/why-easworks.page').then(m => m.WhyEasworksPageComponent)
  },
  // {
  //   path: 'roles/:domain/:role',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./roles/roles.page').then(m => m.RolesPageComponent),
  //   resolve: {
  //     domain: async (route: ActivatedRouteSnapshot) => {
  //       const key = route.paramMap.get('domain');
  //       if (!key)
  //         throw new Error('invalid operation');

  //       return await getDomain(inject(DomainState), key);
  //     },
  //     role: async (route: ActivatedRouteSnapshot) => {
  //       const key = route.paramMap.get('domain');
  //       if (!key)
  //         throw new Error('invalid operation');

  //       const domain = await getDomain(inject(DomainState), key);

  //       const roleInput = route.paramMap.get('role');
  //       if (!roleInput)
  //         throw new Error('invalid operation');

  //       const found = domain.modules.some(m => m.roles.includes(roleInput));

  //       if (!found)
  //         throw new Error(`role '${roleInput}' not found in domain '${domain.key}'`);

  //       return roleInput;
  //     }
  //   }
  // },
  // {
  //   path: 'software/:domain/:software',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./software/software.page').then(m => m.SoftwarePageComponent),
  //   runGuardsAndResolvers: 'pathParamsChange',
  //   resolve: {
  //     domain: async (route: ActivatedRouteSnapshot) => {
  //       const key = route.paramMap.get('domain');
  //       if (!key)
  //         throw new Error('invalid operation');

  //       return await getDomain(inject(DomainState), key);
  //     },
  //     software: async (route: ActivatedRouteSnapshot) => {
  //       const key = route.paramMap.get('software');
  //       if (!key)
  //         throw new Error('invalid operation');

  //       const map$ = inject(DomainState).products.map$;
  //       await toPromise(map$, m => m.size > 0);

  //       const software = map$().get(key);
  //       if (!software)
  //         throw new Error('invalid operation');
  //       return software;
  //     }
  //   }
  // },
  USE_CASES_ROUTE,
  ...HELP_CENTER_ROUTES,
  // {
  //   path: 'about-us',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./about-us/about-us.page').then(m => m.AboutUsPageComponent)
  // },
  {
    path: 'contact-us',
    pathMatch: 'full',
    loadComponent: () => import('./contact-us/contact-us.page').then(m => m.ContactUsPageComponent),
    data: {
      meta: {
        title: 'Contact Us',
        description: 'Random Description'
      } satisfies PageMetadata
    }
  },
  // {
  //   path: 'code-of-conduct',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./code-of-conduct/code-of-conduct.page').then(m => m.CodeOfConductPageComponent),
  //   resolve: {
  //     content: () => inject(HttpClient)
  //       .get('/assets/pages/code-of-conduct/content.md', { responseType: 'text' })

  //   }
  // },
  // {
  //   path: 'cookie-policy',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./cookie-policy/cookie-policy.page').then(m => m.CookiePolicyPageComponent),
  //   resolve: {
  //     content: () => inject(HttpClient)
  //       .get('/assets/pages/cookie-policy/content.md', { responseType: 'text' })
  //   }
  // },
  // {
  //   path: 'data-processing-agreement',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./data-processing-agreement/data-processing-agreement.page').then(m => m.DataProcessingAgreementPageComponent),
  //   resolve: {
  //     content: () => inject(HttpClient)
  //       .get('/assets/pages/data-processing-agreement/content.md', { responseType: 'text' })
  //   }
  // },
  // {
  //   path: 'privacy-policy',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPageComponent),
  //   resolve: {
  //     content: () => inject(HttpClient)
  //       .get('/assets/pages/privacy-policy/content.md', { responseType: 'text' })
  //   }
  // },
  // {
  //   path: 'terms-of-use',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./terms-of-use/terms-of-use.page').then(m => m.TermsOfUsePageComponent),
  //   resolve: {
  //     content: () => inject(HttpClient)
  //       .get('/assets/pages/terms-of-use/content.md', { responseType: 'text' })
  //   }
  // },
  // {
  //   path: 'company-type/:CompanyType',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./company-type/company-type.page').then(m => m.CompanyTypePageComponent),
  //   runGuardsAndResolvers: 'pathParamsChange',
  //   resolve: {
  //     CompanyType: (route: ActivatedRouteSnapshot) => {
  //       const key = route.paramMap.get('CompanyType');
  //       if (!key || !(key in COMPANY_TYPE_DATA))
  //         throw new Error('invalid operation');

  //       return COMPANY_TYPE_DATA[key];
  //     }
  //   }
  // },
  {
    path: 'service-type/hire-contractors',
    pathMatch: 'full',
    loadComponent: () => import('./service-type/hire-contractors/hire-contractors.page')
      .then(m => m.HireContractorsPageComponent)
  },
  // {
  //   path: 'service-type/:ServiceType',
  //   pathMatch: 'full',
  //   loadComponent: () => import('./service-type/service-type.page').then(m => m.ServiceTypePageComponent),
  //   runGuardsAndResolvers: 'pathParamsChange',
  //   resolve: {
  //     ServiceType: (route: ActivatedRouteSnapshot) => {
  //       const key = route.paramMap.get('ServiceType') as GenericTeamServiceID;
  //       if (!key || !(key in GENERIC_SERVICE_TYPE_DATA))
  //         throw new Error('invalid operation');

  //       return GENERIC_SERVICE_TYPE_DATA[key];
  //     }
  //   }
  // },

  {
    path: 'generic-role',
    pathMatch: 'full',
    loadComponent: () => import('./generic-role/generic-role.page').then(m => m.GenericRolePageComponent),
  },
  {
    path: 'landing',
    pathMatch: 'full',
    loadComponent: () => import('./landing/landing.page').then(m => m.LandingPageComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    component: NotFoundPageComponent,
    canMatch: [redirectUser]
  },
];

// async function getDomain(state: DomainState, key: string) {
//   const map$ = inject(DomainState).domains.map$;
//   await toPromise(map$, m => m.size > 0);

//   const domain = map$().get(key);
//   if (!domain)
//     throw new Error('invalid operation');
//   return domain;
// }
