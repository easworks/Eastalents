import { AuthenticatedMenuItem, NOOP_CLICK } from '@easworks/app-shell/navigation/models';
import { AUTH_CHECKS } from '@easworks/app-shell/state/auth';
import { faBriefcase, faCalculator, faIdBadge, faMicrochip, faQuestionCircle, faSquarePollVertical, faUser, faUserGear, faUsers } from '@fortawesome/free-solid-svg-icons';


export const authenticatedMenu: AuthenticatedMenuItem[] = [
  {
    id: 'dashboard', text: 'Dashboard',
    link: '/dashboard',
    icon: faSquarePollVertical,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
      'employer'
    ])
  },
  {
    id: 'talent-profile', text: 'My Profile',
    link: '/talent/profile',
    icon: faUser,
    auth: AUTH_CHECKS.hasRole('talent')
  },
  {
    id: 'employer-profile', text: 'My Profile',
    link: '/employer/profile',
    icon: faUser,
    auth: AUTH_CHECKS.hasRole('employer')
  },

  {
    id: 'work-opportunity', text: 'Work Opportunity',
    link: NOOP_CLICK,
    icon: faBriefcase,
  },
  {
    id: 'gen-ai-vetting', text: 'Gen AI Vetting',
    link: '/gen-ai-vetting',
    icon: faMicrochip,
    auth: AUTH_CHECKS.hasPermission('gen-ai-vetting')
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
    auth: AUTH_CHECKS.hasPermission('cost-calculator')
  },

  {
    id: 'help', text: 'Help',
    link: '/help',
    icon: faQuestionCircle,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
      'employer'
    ])
  },
  {
    id: 'spoc', text: 'SPOC',
    link: '/spoc',
    icon: faIdBadge,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
      'employer'
    ])
  },
  {
    id: 'account', text: 'Account',
    link: '/account',
    icon: faUserGear,
  },


  ...itemsForParent('work-opportunity', [
    {
      id: 'all-jobs', text: 'All Jobs',
      link: '/job-post/list/available',
      auth: AUTH_CHECKS.hasRole('talent')
    },
    {
      id: 'my-applications', text: 'My Applications',
      link: '/job-post/list/applied',
      auth: AUTH_CHECKS.hasRole('talent')
    },
    {
      id: 'saved-jobs', text: 'Saved Jobs',
      link: NOOP_CLICK,
      auth: AUTH_CHECKS.hasRole('talent')
    }
  ]),

  ...itemsForParent('manage-talents', [
    {
      id: 'hire-talents', text: 'Hire Talents',
      link: '/employer/hire-talents',
      auth: AUTH_CHECKS.hasRole('employer')

    },
    {
      id: 'my-teammates', text: 'My Teammates',
      link: '/employer/my-teammates',
      auth: AUTH_CHECKS.hasRole('employer')
    }
  ])

];

function itemsForParent(parent: string, items: AuthenticatedMenuItem[]) {
  items.forEach(item => item.parent = parent);
  return items;
}