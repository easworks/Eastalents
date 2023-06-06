import { MenuItem, NOOP_CLICK } from '@easworks/app-shell';

export const publicMenu = {
  firstPart: () => [
    publicMenu.items.forEnterprises,
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
    forEnterprises: { name: 'For Enterprises', link: NOOP_CLICK },
    forFreelancers: { name: 'For Freelancers', link: NOOP_CLICK },
    whyEasWorks: { name: 'Why EASWORKS?', link: NOOP_CLICK },
    easeworksTalent: { name: 'EASWORKS Talent', link: NOOP_CLICK },
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
  } satisfies { readonly [key: string]: MenuItem }
} as const;
