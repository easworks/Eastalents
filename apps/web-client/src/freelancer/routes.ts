import { Route } from '@angular/router';
import { AUTH_GUARD_CHECKS, AuthGuard } from '@easworks/app-shell/services/auth';

export const FREELANCER_ROUTES: Route[] = [
  {
    path: 'dashboard',
    pathMatch: 'full',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
    },
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.TalentDashboardComponent)
  },
  {
    path: 'gen-ai-vetting',
    pathMatch: 'full',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.hasPermissions(['gen-ai-vetting'])
    },
    loadComponent: () => import('./gen-ai-vitting/gen-ai-vatting.component').then(m => m.GenAiVattingComponent)
  },
  {
    path: 'spoc',
    pathMatch: 'full',
    canMatch: [AuthGuard.asFunction],
    data: {
      auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
    },
    loadComponent: () => import('./spoc/spoc.component').then(m => m.SpocComponent
    )
  },
  {
    path: 'freelancer',
    children: [
      {
        path: 'contact-us',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
        },
        loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent)
      },
      {
        path: 'my-profile',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
        },
        loadComponent: () => import('./my-profile/my-profile.component').then(m => m.MyProfileComponent)
      },
      {
        path: 'my-account',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
        },
        loadComponent: () => import('./my-account/my-account.component').then(m => m.MyAccountComponent)
      },
      {
        path: 'my-applications',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
        },
        loadComponent: () => import('./my-applications/my-applications.component').then(m => m.MyApplicationsComponent)
      },
      {
        path: 'tailmix-profile',
        pathMatch: 'full',
        canMatch: [AuthGuard.asFunction],
        data: {
          auth: AUTH_GUARD_CHECKS.hasPermissions(['role.freelancer'])
        },
        loadComponent: () => import('./teilmix-myprofile/telmix-myprofile.component').then(m => m.TelmixMyprofileComponent)
      },
      {
        path: 'profile',
        pathMatch: 'full',
        loadComponent: () => import('./profile.page').then(m => m.FreelancerProfilePageComponent)
      },
      {
        path: 'profile/edit',
        pathMatch: 'full',
        loadComponent: () => import('./profile-edit.page').then(m => m.FreelancerProfileEditPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      }
    ]
  }
];
