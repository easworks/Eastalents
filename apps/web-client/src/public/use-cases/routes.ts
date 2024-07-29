import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { UseCaseRouteData } from './data-v2';

const useCases = (() => {
  const list = [
    {
      id: 'digital-transformation',
      dynamicComponents: {
        hero: () => import('./digital-transformation/hero/digital-transformation-hero.component')
          .then(m => m.DigitalTransformationHeroComponent),
        details: () => import('./digital-transformation/details/digital-transformation-details.component')
          .then(m => m.DigitalTransformationDetailsComponent),
        overview: () => import('./digital-transformation/overview/digital-transformation-overview.component')
          .then(m => m.DigitalTransformationOverviewComponent),
        process: () => import('./digital-transformation/process/digital-transformation-process.component')
          .then(m => m.DigitalTransformationProcessComponent)
      }
    },
    {
      id: 'software-development',
      dynamicComponents: {
        hero: () => import('./software-development/hero/software-development-hero.component')
          .then(m => m.SoftwareDevelopmentHeroComponent),
        details: () => import('./software-development/details/software-development-details.component')
          .then(m => m.SoftwareDevelopmentDetailsComponent),
        overview: () => import('./software-development/overview/software-development-overview.component')
          .then(m => m.SoftwareDevelopmentOverviewComponent),
        process: () => import('./software-development/process/software-development-process.component')
          .then(m => m.SoftwareDevelopmentProcessComponent)
      }
    },
    {
      id: 'advisory-and-consultancy',
      dynamicComponents: {
        hero: () => import('./advisory-and-consultancy/hero/advisory-and-consultancy-hero.component')
          .then(m => m.AdvisoryAndConsultancyHeroComponent),
        details: () => import('./advisory-and-consultancy/details/advisory-and-consultancy-details.component')
          .then(m => m.AdvisoryAndConsultancyDetailsComponent),
        overview: () => import('./advisory-and-consultancy/overview/advisory-and-consultancy-overview.component')
          .then(m => m.AdvisoryAndConsultancyOverviewComponent),
        process: () => import('./advisory-and-consultancy/process/advisory-and-consultancy-process.component')
          .then(m => m.AdvisoryAndConsultancyProcessComponent)
      }
    },
    {
      id: 'prototyping',
      dynamicComponents: {
        hero: () => import('./prototyping/hero/prototyping-hero.component')
          .then(m => m.PrototypingHeroComponent),
        details: () => import('./prototyping/details/prototyping-details.component')
          .then(m => m.PrototypingDetailsComponent),
        overview: () => import('./prototyping/overview/prototyping-overview.component')
          .then(m => m.PrototypingOverviewComponent),
        process: () => import('./prototyping/process/prototyping-process.component')
          .then(m => m.PrototypingProcessComponent)
      }
    },

    {
      id: 'modernization',
      dynamicComponents: {
        hero: () => import('./modernization/hero/modernization-hero.component')
          .then(m => m.ModernizationHeroComponent),
        details: () => import('./modernization/details/modernization-details.component')
          .then(m => m.ModernizationDetailsComponent),
        overview: () => import('./modernization/overview/modernization-overview.component')
          .then(m => m.ModernizationOverviewComponent),
        process: () => import('./modernization/process/modernization-process.component')
          .then(m => m.ModernizationProcessComponent)
      }
    },
  ] as const;

  return Object.fromEntries(list.map(uc => [uc.id, uc]));
})();

export const USE_CASES_ROUTE: Route = {
  path: 'use-cases/:useCaseId',
  pathMatch: 'full',
  loadComponent: () => import('./use-cases.page').then(m => m.UseCasesPageComponent),
  resolve: {
    useCaseData: async (snap: ActivatedRouteSnapshot) => {
      const router = inject(Router);
      const id = snap.paramMap.get('useCaseId');
      if (!id)
        throw new Error('unexpected error');

      if (!(id in useCases)) {
        router.navigateByUrl(`/error-404`, { skipLocationChange: true });
        throw new Error('not found');
      }

      const dynamicComponents = await (async () => {

        const components = await Promise.all([
          useCases[id].dynamicComponents.hero(),
          useCases[id].dynamicComponents.details(),
          useCases[id].dynamicComponents.overview(),
          useCases[id].dynamicComponents.process(),
        ]);

        const [hero, details, overview, process] = components;
        return { hero, details, overview, process };

      })();

      const data: UseCaseRouteData = {
        id,
        dynamicComponents
      };

      return data;
    }
  }
};