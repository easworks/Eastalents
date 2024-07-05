import { computed, effect, inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { authFeature } from './auth';
import { navMenuActions, navMenuFeature } from './nav-menu';

export const navMenuEffects = {
  updateAllowedItems: createEffect(
    () => {
      const store = inject(Store);

      const user$ = store.selectSignal(authFeature.selectUser);
      const menu$ = store.selectSignal(navMenuFeature.selectAll);

      const allowed$ = computed(() => {
        const user = user$();
        if (!user)
          return new Set<string>();

        const allowedIds = new Set<string>();

        const menu = menu$();

        for (const item of menu.list) {
          // TODO: implement the check
          const allowed = true;

          if (allowed)
            allowedIds.add(item.id);

          let parent = item.parent;
          while (parent) {
            if (allowedIds.has(parent))
              break;
            allowedIds.add(parent);
            parent = menu.map[parent]?.id;
          }
        }

        return allowedIds;
      });

      effect(() => {
        const items = allowed$();
        store.dispatch(navMenuActions.updateAllowedItems({ payload: { items } }));
      }, { allowSignalWrites: true });

      return EMPTY;
    },
    { functional: true, dispatch: false }
  )
} as const;