import { AuthenticatedMenuItem, NOOP_CLICK } from '@easworks/app-shell/navigation/models';
import { AUTH_CHECKS } from '@easworks/app-shell/state/auth';
import { faBriefcase, faBuilding, faCalculator, faGaugeHigh, faIdBadge, faMicrochip, faQuestionCircle, faSquarePollVertical, faUser, faUserCheck, faUserGear, faUsers, faUserTie } from '@fortawesome/free-solid-svg-icons';


export const authenticatedMenu: AuthenticatedMenuItem[] = [
  {
    id: 'dashboard', text: 'Dashboard',
    link: '/dashboard',
    icon: faGaugeHigh,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
    ])
  },
  {
    id: 'hiring-overview', text: 'Hiring Overview',
    link: '/hiring-overview',
    icon: faGaugeHigh,
    auth: AUTH_CHECKS.hasRole.any([
      'employer'
    ])
  },
  {
    id: 'talent-profile', text: 'Profile',
    link: '/talent/profile',
    icon: faUser,
    auth: AUTH_CHECKS.hasRole('talent')
  },
  {
    id: 'employer-profile', text: 'Company Profile',
    link: '/employer/profile',
    icon: faBuilding,
    auth: AUTH_CHECKS.hasRole('employer')
  },

  {
    id: 'job-opportunity', text: 'Job Opportunity',
    link: NOOP_CLICK,
  },
  {
    id: 'gen-ai-vetting', text: 'AI Talent Vetting',
    link: '/gen-ai-vetting',
    icon: faMicrochip,
    auth: AUTH_CHECKS.hasPermission('gen-ai-vetting')
  },
  {
    id: 'manage-talents', text: 'Manage Talent',
    link: NOOP_CLICK,
    icon: faUsers,
  },
  {
    id: 'manage-job-listing', text: 'Manage Job Listing',
    link: '/manage-job-listing',
    icon: faBriefcase,
  },
  {
    id: 'budget-planner', text: 'Budget Planner',
    link: '/employer/budget-planner',
    icon: faCalculator,
    auth: AUTH_CHECKS.hasRole('employer')
  },

  {
    id: 'support-center', text: 'Support Center',
    link: '/support-center',
    icon: faQuestionCircle,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
      'employer'
    ])
  },
  {
    id: 'spoc', text: 'Talent Success Manager',
    link: '/spoc',
    icon: faIdBadge,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
    ])
  },
  {
    id: 'customer-success-manager', text: 'Customer Success Manager',
    link: '/customer-success-manager',
    icon: faUserTie,
    auth: AUTH_CHECKS.hasRole.any([
      'employer',
    ])
  },
  
  {
    id: 'account', text: 'My Account',
    link: '/account',
    icon: faUserGear,
    auth: AUTH_CHECKS.hasRole.any([
      'talent',
    ])
  },

  {
    id: 'account-setting', text: 'Account Settings',
    link: '/account-setting',
    icon: faUserGear,
    
  },


  ...itemsForParent('job-opportunity', [
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

  ...itemsForParent('manage-job-listing', [
    {
      id: 'employer-all-jobs', text: 'All Jobs',
      link: '/job-post/list/available',
      auth: AUTH_CHECKS.hasRole('employer')
    },
    {
      id: 'employer-my-applications', text: 'My Applications',
      link: '/job-post/list/applied',
      auth: AUTH_CHECKS.hasRole('employer')
    },
    {
      id: 'employer-saved-jobs', text: 'Saved Jobs',
      link: '/job-post/list/saved-jobs',
      auth: AUTH_CHECKS.hasRole('employer')
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
  ]),

  ...itemsForParent('employer-profile', [
    {
      id: 'general-info', text: 'General Information',
      link: '/employer/general-info',
      auth: AUTH_CHECKS.hasRole('employer')
    }
  ])

];

function itemsForParent(parent: string, items: AuthenticatedMenuItem[]) {
  items.forEach(item => item.parent = parent);
  return items;
}