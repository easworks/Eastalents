import { Route } from '@angular/router';
import { NotFoundPageComponent } from '@easworks/app-shell/navigation/not-found/not-found.page';
import { oauthCodeCallback } from './oauth-code-callback';

export const ACCOUNT_ROUTES: Route[] = [
  {
    path: 'oauth/callback',
    pathMatch: 'full',
    canActivate: [oauthCodeCallback],
    component: NotFoundPageComponent,
  }
];
