import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found.page';
import { AuthState } from '@easworks/app-shell/state/auth';
import { socialCallbackGuard } from './social-callback';
import { emailVerificationGuard } from './verification-callback';

const redirectUser: CanActivateFn = () => {
  const user = inject(AuthState).user$();


  if (user) {
    const router = inject(Router);
    return router.createUrlTree(['/account/sign-in']);
  }

  return true;
};


export const ACCOUNT_ROUTE: Route = {
  path: 'account',
  children: [
    {
      path: 'sign-up/freelancer',
      pathMatch: 'full',
      canActivate: [redirectUser],
      loadComponent: () => import('./freelancer-sign-up.page').then(m => m.FreelancerSignUpPageComponent),
      data: {
        seo: {
          title: () => 'Sign Up as Freelancer'
        }
      }
    },
    {
      path: 'sign-up/organization',
      pathMatch: 'full',
      canActivate: [redirectUser],
      loadComponent: () => import('./employer-sign-up.page').then(m => m.OrganizationSignUpPageComponent),
      data: {
        seo: {
          title: () => 'Sign Up as an Organization'
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
      path: 'email-verification',
      pathMatch: 'full',
      canActivate: [emailVerificationGuard],
      loadComponent: () => NotFoundPageComponent
    },
    {
      path: 'social/callback',
      pathMatch: 'full',
      canActivate: [socialCallbackGuard],
      loadComponent: () => NotFoundPageComponent
    }
  ]
};
