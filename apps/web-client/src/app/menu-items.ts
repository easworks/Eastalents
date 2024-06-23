import { MenuItem, NOOP_CLICK } from '@easworks/app-shell/state/menu';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBriefcase, faCubes, faDiagramNext, faGroupArrowsRotate, faHeadset, faLightbulb, faMicrochip, faPaintBrush, faPenRuler, faRocket } from '@fortawesome/free-solid-svg-icons';

export const publicMenu = {
  firstPart: () => [
    publicMenu.items.forCompanies,
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
    forCompanies: { name: 'For Companies', link: '/for-companies' },
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
    applyAsFreelancer: { name: 'Apply as Freelancer', link: '/register/freelancer' },
    aboutUs: { name: 'About Us', link: '/about-us' },
    codeOfConduct: { name: 'Code of Conduct', link: 'code-of-conduct' },
    contactUs: { name: 'Contact Us', link: '/contact-us' },
    dataProcessingAgreement: { name: 'Data Processing Agreement', link: '/data-processing-agreement' },
    helpCenter: { name: 'Help Center', link: '/help-center' }
  } satisfies { readonly [key: string]: MenuItem; }
} as const;


export const socialIcons = [
  {
    name: 'LinkedIn',
    icon: faLinkedin,
    link: 'https://www.linkedin.com/company/easworks'
  },
  {
    name: 'Facebook',
    icon: faFacebook,
    link: 'https://web.facebook.com/easworks/'
  },
  {
    name: 'GitHub',
    icon: faGithub,
    link: 'https://github.com/easworks'
  },
  {
    name: 'Twitter',
    icon: faTwitter,
    link: 'https://twitter.com/easworks/'
  },
  {
    name: 'Instagram',
    icon: faInstagram,
    link: 'https://www.instagram.com/easworks121/'
  },
  {
    name: 'YouTube',
    icon: faYoutube,
    link: 'https://www.youtube.com/@easworks'
  }
];


