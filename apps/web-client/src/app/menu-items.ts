import { MenuItem, NOOP_CLICK } from 'app-shell';

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
    forEnterprise: { name: 'For Enterprise', link: NOOP_CLICK },
    forFreelancers: { name: 'For Freelancers', link: NOOP_CLICK },
    useCases: { name: 'Use Cases', link: NOOP_CLICK },
    applyAsFreelancer: { name: 'Apply as Freelancer', link: NOOP_CLICK }
  } satisfies { readonly [key: string]: MenuItem }
} as const;
