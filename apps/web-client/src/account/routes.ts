import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { AuthState, NotFoundPageComponent } from '@easworks/app-shell';
import { socialCallbackGuard } from './social-callback';

const redirectUser: CanActivateFn = () => {
  const user = inject(AuthState).user$();


  if (user) {
    const router = inject(Router);
    return router.createUrlTree(['/account/sign-in'])
  }

  return true;
}


export const ACCOUNT_ROUTES: Route = {
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
      path: 'sign-up/enterprise',
      pathMatch: 'full',
      canActivate: [redirectUser],
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
      canActivate: [socialCallbackGuard],
      loadComponent: () => NotFoundPageComponent
    }
  ]
};
