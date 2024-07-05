import { AuthenticatedMenuItem, NOOP_CLICK } from '@easworks/app-shell/navigation/models';
import { faBriefcase, faCalculator, faIdBadge, faMicrochip, faQuestionCircle, faSitemap, faSquarePollVertical, faUser, faUserGear, faUsers } from '@fortawesome/free-solid-svg-icons';

export const authenticatedMenu: AuthenticatedMenuItem[] = [
  {
    id: 'dashboard', text: 'Dashboard',
    link: '/dashboard',
    icon: faSquarePollVertical,
    permissions: [
      'role.freelancer',
      'role.employer'
    ]
  },
  {
    id: 'profile', text: 'My Profile',
    link: '/freelancer/profile/me',
    icon: faUser,
    permissions: ['role.freelancer']
  },

  {
    id: 'work-opportunity', text: 'Work Opportunity',
    link: NOOP_CLICK,
    icon: faBriefcase,
  },
  {
    id: 'gen-ai-vetting', text: 'Gen AI Vetting',
    link: NOOP_CLICK,
    icon: faMicrochip,
    permissions: ['gen-ai-vetting']
  },

  {
    id: 'company-info', text: 'Company Info',
    link: NOOP_CLICK,
    icon: faSitemap,
  },
  {
    id: 'manage-talents', text: 'Manage Talents',
    link: NOOP_CLICK,
    icon: faUsers,
  },
  {
    id: 'cost-calculator', text: 'Cost Calculator',
    link: '/employer/cost-calculator',
    icon: faCalculator,
    permissions: ['cost-calculator']
  },

  {
    id: 'help', text: 'Help',
    link: NOOP_CLICK,
    icon: faQuestionCircle,
  },
  {
    id: 'spoc', text: 'SPOC',
    link: NOOP_CLICK,
    icon: faIdBadge,
  },
  {
    id: 'employer-account', text: 'My Account',
    link: '/employer/account',
    icon: faUserGear,
    permissions: ['role.employer']
  },

  ...itemsForParent('work-opportunity', [
    {
      id: 'all-jobs', text: 'All Jobs',
      link: NOOP_CLICK,
      permissions: ['role.freelancer']
    },
    {
      id: 'my-applications', text: 'My Applications',
      link: NOOP_CLICK,
      permissions: ['role.freelancer']
    },
    {
      id: 'saved-jobs', text: 'Saved Jobs',
      link: NOOP_CLICK,
      permissions: ['role.freelancer']
    }
  ]),

  ...itemsForParent('company-info', [
    {
      id: 'general-company-info', text: 'General Information',
      link: '/employer/general-info',
      permissions: ['role.employer']
    }
  ]),

  ...itemsForParent('manage-talents', [
    {
      id: 'hire-talents', text: 'Hire Talents',
      link: '/employer/hire-talents',
      permissions: ['role.employer']
    },
    {
      id: 'my-teammates', text: 'My Teammates',
      link: NOOP_CLICK,
      permissions: ['role.employer']
    }
  ])

];

function itemsForParent(parent: string, items: AuthenticatedMenuItem[]) {
  items.forEach(item => item.parent = parent);
  return items;
}