import { navMenuActions } from '@easworks/app-shell/state/nav-menu';
import { createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { authenticatedMenu } from './authenticated';

export const menuItemEffects = {
  updateAllItems: createEffect(
    () => {
      return of(navMenuActions.updateAllItems({ payload: { items: authenticatedMenu } }));
    },
    { functional: true }
  )
} as const;