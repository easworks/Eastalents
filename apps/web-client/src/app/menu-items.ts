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
        { name: 'Digital Transformation (DX)', link: NOOP_CLICK, icon: faMicrochip },
        { name: 'Innovation', link: NOOP_CLICK, icon: faLightbulb },
        { name: 'Prototyping', link: NOOP_CLICK, icon: faPenRuler },
        { name: 'Enterprise Application Design', link: NOOP_CLICK, icon: faPaintBrush },
        { name: 'Business Intelligence', link: NOOP_CLICK, icon: faBriefcase },
        { name: 'Application Modernization', link: NOOP_CLICK, icon: faRocket },
        { name: 'Enterprise Application Integration', link: NOOP_CLICK, icon: faGroupArrowsRotate },
        { name: 'Custom Enterprise Application', link: NOOP_CLICK, icon: faCubes },
        { name: 'Data Migration', link: NOOP_CLICK, icon: faDiagramNext },
        { name: 'Support & Maintenance', link: NOOP_CLICK, icon: faHeadset },
      ]
    },
    applyAsFreelancer: { name: 'Apply as Freelancer', link: '/account/sign-up/freelancer' }
  } satisfies { readonly [key: string]: MenuItem; }
} as const;
