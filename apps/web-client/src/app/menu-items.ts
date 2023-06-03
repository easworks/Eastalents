import { MenuItem, NOOP_CLICK } from '@easworks/app-shell';

export const publicMenu = {
  firstPart: () => [
    publicMenu.items.whyEaseWorks,
    publicMenu.items.forEnterprise,
    publicMenu.items.forFreelancers,
  ],
  secondPart: () => [
    publicMenu.items.useCases,
    publicMenu.items.applyAsFreelancer,
  ],
  full: () => [
    ...publicMenu.firstPart(),
    ...publicMenu.secondPart()
  ],
  items: {
    whyEaseWorks: { name: 'Why EASWORKS?', link: NOOP_CLICK },
    forEnterprise: {
      name: 'For Enterprise', link: NOOP_CLICK,
      children: [
        { name: 'EASWorks Talents', link: NOOP_CLICK },
        { name: 'How It Works', link: NOOP_CLICK }
      ]
    },
    forFreelancers: { name: 'For Freelancers', link: NOOP_CLICK },
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
    applyAsFreelancer: { name: 'Apply as Freelancer', link: NOOP_CLICK }
  } satisfies { readonly [key: string]: MenuItem }
} as const;
