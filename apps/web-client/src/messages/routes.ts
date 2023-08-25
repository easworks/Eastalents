import { Route } from '@angular/router';
import { AuthGuard } from '@easworks/app-shell/services/auth';
import { MessagesPageComponent } from './messages.page';

export const MESSAGES_ROUTE: Route = {
  path: 'messages',
  canMatch: [AuthGuard.asFunction],
  loadComponent: () => MessagesPageComponent
};
