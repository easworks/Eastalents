import { MenuItem, NOOP_CLICK } from '@easworks/app-shell/state/menu';

export const publicMenu = {
  firstPart: () => [
    publicMenu.items.forOrgs,
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
    forOrgs: { name: 'For Organizations', link: NOOP_CLICK },
    forFreelancers: { name: 'For Freelancers', link: '/for-freelancer' },
    whyEasWorks: { name: 'Why EASWORKS?', link: '/why-easworks' },
    easeworksTalent: { name: 'EASWORKS Talent', link: '/easworks-talent' },
    useCases: {
      name: 'Use Cases', link: NOOP_CLICK,
      children: [
        { name: 'Digital Transformation (DX)', link: NOOP_CLICK, icon: 'fa-microchip' },
        { name: 'Innovation', link: NOOP_CLICK, icon: 'fa-lightbulb' },
        { name: 'Prototyping', link: NOOP_CLICK, icon: 'fa-pen-ruler' },
        { name: 'Enterprise Application Design', link: NOOP_CLICK, icon: 'fa-paintbrush' },
        { name: 'Business Intelligence', link: NOOP_CLICK, icon: 'fa-briefcase' },
        { name: 'Application Modernization', link: NOOP_CLICK, icon: 'fa-rocket' },
        { name: 'Enterprise Application Integration', link: NOOP_CLICK, icon: 'fa-group-arrows-rotate' },
        { name: 'Custom Enterprise Application', link: NOOP_CLICK, icon: 'fa-cubes' },
        { name: 'Data Migration', link: NOOP_CLICK, icon: 'fa-diagram-next' },
        { name: 'Support & Maintenance', link: NOOP_CLICK, icon: 'fa-headset' },
      ]
    },
    applyAsFreelancer: { name: 'Apply as Freelancer', link: '/account/sign-up/freelancer' }
  } satisfies { readonly [key: string]: MenuItem; }
} as const;
