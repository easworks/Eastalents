import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { authFeature } from '@easworks/app-shell/state/auth';
import { Store } from '@ngrx/store';
import { socialCallbackGuard } from './social-callback';
import { emailVerificationGuard } from './verification-callback';

const redirectUser: CanActivateFn = () => {
  const store = inject(Store);
  const user = store.selectSignal(authFeature.selectUser)();


  if (user) {
    const router = inject(Router);
    return router.createUrlTree(['/account/sign-in']);
  }

  return true;
};


export const ACCOUNT_ROUTES: Route[] = [
  {
    path: 'register',
    children: [
      {
        path: 'freelancer',
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
        path: 'employer',
        pathMatch: 'full',
        canActivate: [redirectUser],
        loadComponent: () => import('./employer-sign-up.page').then(m => m.EmployerSignUpPageComponent),
        data: {
          seo: {
            title: () => 'Sign Up as an Employer'
          }
        }
      },
      {
        path: 'verify-email',
        pathMatch: 'full',
        canActivate: [redirectUser],
        loadComponent: () => import('./verification-email-sent.page')
          .then(m => m.VerificationEmailSentPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./sign-up-choice.page').then(m => m.AccountRegistrationTypeChoicePageComponent)
      }
    ]
  },
  {
    path: 'account',
    children: [

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
  }
];
