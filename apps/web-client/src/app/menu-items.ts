import { MenuItem, NOOP_CLICK } from '@easworks/app-shell/state/menu';
import { faBriefcase, faCubes, faDiagramNext, faGroupArrowsRotate, faHeadset, faLightbulb, faMicrochip, faPaintBrush, faPenRuler, faRocket } from '@fortawesome/free-solid-svg-icons';

export const publicMenu = {
  firstPart: () => [
    publicMenu.items.forEmployers,
    publicMenu.items.forFreelancers,
    publicMenu.items.whyEasWorks,
  ],
  secondPart: () => [
    publicMenu.items.easeworksTalent,
    publicMenu.items.useCases,
    publicMenu.items.applyAsFreelancer,
  ],
  full: () => [
    ...publicMenu.firstPart(),
    ...publicMenu.secondPart()
  ],
  items: {
    forEmployers: { name: 'For Employers', link: '/for-employers' },
    forFreelancers: { name: 'For Freelancers', link: '/for-freelancer' },
    whyEasWorks: { name: 'Why EASWORKS?', link: '/why-easworks' },
    easeworksTalent: { name: 'EASWORKS Talent', link: '/easworks-talent' },
    useCases: {
      name: 'Use Cases', link: NOOP_CLICK,
      children: [
        { name: 'Digital Transformation (DX)', link: '/use-cases/digital-transformation', icon: faMicrochip },
        { name: 'Innovation', link: '/use-cases/innovation', icon: faLightbulb },
        { name: 'Prototyping', link: '/use-cases/prototyping', icon: faPenRuler },
        { name: 'Enterprise Application Design', link: '/use-cases/enterprise-application-design', icon: faPaintBrush },
        { name: 'Business Intelligence', link: '/use-cases/business-intelligence', icon: faBriefcase },
        { name: 'Application Modernization', link: '/use-cases/application-modernization', icon: faRocket },
        { name: 'Enterprise Application Integration', link: '/use-cases/enterprise-application-integration', icon: faGroupArrowsRotate },
        { name: 'Custom Enterprise Application', link: '/use-cases/custom-enterprise-application', icon: faCubes },
        { name: 'Data Migration', link: '/use-cases/data-migration', icon: faDiagramNext },
        { name: 'Support & Maintenance', link: '/use-cases/support-and-maintenance', icon: faHeadset },
      ]
    },
    applyAsFreelancer: { name: 'Apply as Freelancer', link: '/account/sign-up/freelancer' }
  } satisfies { readonly [key: string]: MenuItem; }
} as const;
