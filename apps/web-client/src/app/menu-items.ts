import { MenuItem, NOOP_CLICK } from '@easworks/app-shell/navigation/models';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBriefcase, faCubes, faDiagramNext, faGroupArrowsRotate, faHeadset, faLightbulb, faMicrochip, faPaintBrush, faPenRuler, faRocket } from '@fortawesome/free-solid-svg-icons';

const useCases = {
  text: 'Use Cases', link: NOOP_CLICK,
  children: [
    { text: 'Digital Transformation (DX)', link: '/use-cases/digital-transformation', icon: faMicrochip },
    { text: 'Innovation', link: '/use-cases/innovation', icon: faLightbulb },
    { text: 'Prototyping', link: '/use-cases/prototyping', icon: faPenRuler },
    { text: 'Enterprise Application Design', link: '/use-cases/enterprise-application-design', icon: faPaintBrush },
    { text: 'Business Intelligence', link: '/use-cases/business-intelligence', icon: faBriefcase },
    { text: 'Application Modernization', link: '/use-cases/application-modernization', icon: faRocket },
    { text: 'Enterprise Application Integration', link: '/use-cases/enterprise-application-integration', icon: faGroupArrowsRotate },
    { text: 'Custom Enterprise Application', link: '/use-cases/custom-enterprise-application', icon: faCubes },
    { text: 'Data Migration', link: '/use-cases/data-migration', icon: faDiagramNext },
    { text: 'Support & Maintenance', link: '/use-cases/support-and-maintenance', icon: faHeadset },
  ]
} satisfies MenuItem;

export const publicMenu = {
  main: [
    { text: 'For Companies', link: '/for-companies' },
    { text: 'For Freelancers', link: '/for-freelancer' },
    { text: 'Why Easworks?', link: '/why-easworks' },
    { text: 'EASWORKS Talent', link: '/easworks-talent' },
    useCases,
    { text: 'Apply as Freelancer', link: '/register/freelancer' }
  ] satisfies MenuItem[],
  static: [
    { text: 'Hire Talent', link: NOOP_CLICK },
    { text: 'For Client', link: NOOP_CLICK },
    { text: 'Join EASWORKS', link: NOOP_CLICK },
    { text: 'For Freelancers', link: NOOP_CLICK },
  ] satisfies MenuItem[],
  about: [
    { text: 'Resources', link: NOOP_CLICK },
    { text: 'Blog', link: NOOP_CLICK },
    { text: 'Press Center', link: NOOP_CLICK },
    { text: 'About EASWORKS', link: NOOP_CLICK },
    { text: 'Careers', link: NOOP_CLICK },
  ] satisfies MenuItem[],
  social: [
    { text: 'LinkedIn', icon: faLinkedin, link: 'https://www.linkedin.com/company/easworks' },
    { text: 'Facebook', icon: faFacebook, link: 'https://web.facebook.com/easworks/' },
    { text: 'GitHub', icon: faGithub, link: 'https://github.com/easworks' },
    { text: 'Twitter', icon: faTwitter, link: 'https://twitter.com/easworks/' },
    { text: 'Instagram', icon: faInstagram, link: 'https://www.instagram.com/easworks121/' },
    { text: 'YouTube', icon: faYoutube, link: 'https://www.youtube.com/@easworks' }
  ] satisfies MenuItem[],
} as const;

export const footerNav: {
  name: string,
  class?: string,
  items: MenuItem[];
}[] = [
    {
      name: 'For Companies',
      class: 'col-span-6 @sm:col-span-6 @3xl:col-span-4 @6xl:col-span-3',
      items: [
        { text: 'Hire EAS Talents', link: NOOP_CLICK },
        { text: 'Book a Call', link: NOOP_CLICK },
        { text: 'Explore Services', link: NOOP_CLICK },
        { text: 'Hire for specific skills', link: NOOP_CLICK },
        { text: 'FAQ-Client', link: NOOP_CLICK }
      ],
    },
    {
      name: 'For Talents',
      class: 'col-span-6 @sm:col-span-6 @3xl:col-span-4 @6xl:col-span-3',
      items: [
        { text: 'Apply for Jobs', link: NOOP_CLICK },
        { text: 'Freelancer Login', link: NOOP_CLICK },
        { text: 'FAQ -Talent', link: NOOP_CLICK },
      ],
    },
    {
      name: 'Use cases',
      class: 'col-span-12 @sm:col-span-6 @3xl:col-span-4 @3xl:row-span-2 @3xl:col-start-1 @6xl:col-span-3 @6xl:col-start-7',
      items: useCases.children,
    },
    {
      name: 'Industries',
      class: 'col-span-12 @sm:col-span-6 @3xl:col-span-4 @3xl:row-span-2 @3xl:col-start-5 @6xl:col-span-3 @6xl:col-start-10',
      items: [
        { text: 'Automotive', link: NOOP_CLICK },
        { text: 'Aerospace and Defense', link: NOOP_CLICK },
        { text: 'Retail and E-commerce', link: NOOP_CLICK },
        { text: 'Manufacturing', link: NOOP_CLICK },
        { text: 'Retail and E-commerce', link: NOOP_CLICK },
        { text: 'Healthcare', link: NOOP_CLICK },
        { text: 'Financial Services', link: NOOP_CLICK },
        { text: 'Electronics and High Tech', link: NOOP_CLICK },
        { text: 'Consumer Packaged Goods', link: NOOP_CLICK },
        { text: 'Pharmaceuticals', link: NOOP_CLICK },
      ],
    },
    {
      name: 'About',
      class: 'col-span-12 @sm:col-span-6 @3xl:col-span-4 @3xl:col-start-9 @6xl:col-span-3',
      items: [
        { text: 'About Us', link: '/about-us' },
        { text: 'Blog', link: NOOP_CLICK },
        { text: 'Careers', link: NOOP_CLICK },
        { text: 'Community', link: NOOP_CLICK },
        { text: 'Code of Conduct', link: 'code-of-conduct' },
        { text: 'Data Processing Agreement', link: '/data-processing-agreement' }
      ],
    },
    {
      name: 'Contact Us',
      class: 'col-span-12 @sm:col-span-6 @3xl:col-span-4 @3xl:col-start-9 @6xl:col-span-3',
      items: [
        { text: 'Contact Us', link: '/contact-us' },
        { text: 'Help Center', link: '/help-center' }
      ],
    }
  ];



