import { MenuItem } from '@easworks/app-shell/navigation/models';
import { NOOP_CLICK } from '@easworks/app-shell/state/menu';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBriefcase, faCubes, faDiagramNext, faGroupArrowsRotate, faHeadset, faLightbulb, faMicrochip, faPaintBrush, faPenRuler, faRocket } from '@fortawesome/free-solid-svg-icons';

const publicMenu: MenuItem[] = [
  { id: 'for-companies', text: 'For Companies', link: '/for-companies' },
  { id: 'for-freelancers', text: 'For Freelancers', link: '/for-freelancer' },
  { id: 'why-easworks', text: 'Why Easworks?', link: '/why-easworks' },
  { id: 'easworks-talent', text: 'EASWORKS Talent', link: '/easworks-talent' },
  {
    id: 'use-cases', text: 'Use Cases', link: NOOP_CLICK,
    children: [
      { id: 'use-case-digital-transformation', text: 'Digital Transformation (DX)', link: '/use-cases/digital-transformation', icon: faMicrochip },
      { id: 'use-case-innovation', text: 'Innovation', link: '/use-cases/innovation', icon: faLightbulb },
      { id: 'use-case-prototyping', text: 'Prototyping', link: '/use-cases/prototyping', icon: faPenRuler },
      { id: 'use-case-enterprise-app-design', text: 'Enterprise Application Design', link: '/use-cases/enterprise-application-design', icon: faPaintBrush },
      { id: 'use-case-business-intelligence', text: 'Business Intelligence', link: '/use-cases/business-intelligence', icon: faBriefcase },
      { id: 'use-case-app-modernization', text: 'Application Modernization', link: '/use-cases/application-modernization', icon: faRocket },
      { id: 'use-case-app-integration', text: 'Enterprise Application Integration', link: '/use-cases/enterprise-application-integration', icon: faGroupArrowsRotate },
      { id: 'use-case-enterprise-app', text: 'Custom Enterprise Application', link: '/use-cases/custom-enterprise-application', icon: faCubes },
      { id: 'use-case-data-migration', text: 'Data Migration', link: '/use-cases/data-migration', icon: faDiagramNext },
      { id: 'use-case-support-and-maintenance', text: 'Support & Maintenance', link: '/use-cases/support-and-maintenance', icon: faHeadset },
    ]
  },
  { id: 'register-freelancer', text: 'Apply as Freelancer', link: '/register/freelancer' },
  { id: 'about-us', text: 'About Us', link: '/about-us' },
  { id: 'code-of-conduct', text: 'Code of Conduct', link: 'code-of-conduct' },
  { id: 'contact-us', text: 'Contact Us', link: '/contact-us' },
  { id: 'data-processing-agreement', text: 'Data Processing Agreement', link: '/data-processing-agreement' },
  { id: 'help-center', text: 'Help Center', link: '/help-center' }
];

const socialIcons: MenuItem[] = [
  { id: 'social-linkedin', text: 'LinkedIn', icon: faLinkedin, link: 'https://www.linkedin.com/company/easworks' },
  { id: 'social-facebook', text: 'Facebook', icon: faFacebook, link: 'https://web.facebook.com/easworks/' },
  { id: 'social-github', text: 'GitHub', icon: faGithub, link: 'https://github.com/easworks' },
  { id: 'social-twitter', text: 'Twitter', icon: faTwitter, link: 'https://twitter.com/easworks/' },
  { id: 'social-instagram', text: 'Instagram', icon: faInstagram, link: 'https://www.instagram.com/easworks121/' },
  { id: 'social-youtube', text: 'YouTube', icon: faYoutube, link: 'https://www.youtube.com/@easworks' }
];