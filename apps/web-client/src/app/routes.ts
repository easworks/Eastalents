import { Routes } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell';


export const routes: Routes = [
  {
    path: 'account',
    children: [
      {
        path: 'sign-up/freelancer',
        pathMatch: 'full',
        loadComponent: () => import('../account/freelancer-sign-up.page').then(m => m.FreelancerSignUpPageComponent),
        data: {
          seo: {
            title: () => 'Sign Up as Freelancer'
          }
        }
      },
      {
        path: 'sign-up/enterprise',
        pathMatch: 'full',
        loadComponent: () => import('../account/enterprise-sign-up.page').then(m => m.EnterpriseSignUpPageComponent),
        data: {
          seo: {
            title: () => 'Sign Up as Enterprise'
          }
        }
      },
      {
        path: 'sign-in',
        pathMatch: 'full',
        loadComponent: () => import('../account/sign-in.page').then(m => m.AccountSignInPageComponent),
        data: {
          seo: {
            title: () => 'Sign In'
          }
        }
      },
      {
        path: 'reset-password',
        pathMatch: 'full',
        loadComponent: () => import('../account/password-reset.page').then(m => m.AccountPasswordResetPageComponent),
        data: {
          seo: {
            title: () => 'Reset Password'
          }
        }
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => NotFoundPageComponent
  }
];