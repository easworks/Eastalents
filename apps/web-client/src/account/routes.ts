import { Route } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell';
import { socialCallback } from './social-callback';

export const ACCOUNT_ROUTES: Route = {
  path: 'account',
  children: [
    {
      path: 'sign-up/freelancer',
      pathMatch: 'full',
      loadComponent: () => import('./freelancer-sign-up.page').then(m => m.FreelancerSignUpPageComponent),
      data: {
        seo: {
          title: () => 'Sign Up as Freelancer'
        }
      }
    },
    {
      path: 'sign-up/enterprise',
      pathMatch: 'full',
      loadComponent: () => import('./enterprise-sign-up.page').then(m => m.EnterpriseSignUpPageComponent),
      data: {
        seo: {
          title: () => 'Sign Up as Enterprise'
        }
      }
    },
    {
      path: 'sign-in',
      pathMatch: 'full',
      loadComponent: () => import('./sign-in.page').then(m => m.AccountSignInPageComponent),
      data: {
        seo: {
          title: () => 'Sign In'
        }
      }
    },
    {
      path: 'reset-password',
      pathMatch: 'full',
      loadComponent: () => import('./password-reset.page').then(m => m.AccountPasswordResetPageComponent),
      data: {
        seo: {
          title: () => 'Reset Password'
        }
      }
    },
    {
      path: 'social/callback',
      pathMatch: 'full',
      canActivate: [socialCallback],
      loadComponent: () => NotFoundPageComponent,
    }
  ]
};
