import { computed, effect, inject, untracked } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { AuthenticatedMenuItem } from '../navigation/models';
import { isPermissionDefined, isPermissionGranted } from '../permissions';
import { authFeature } from './auth';
import { navMenuActions, navMenuFeature } from './nav-menu';

export const navMenuEffects = {
  updateAllowedItems: createEffect(
    () => {
      const store = inject(Store);

      const user$ = store.selectSignal(authFeature.selectUser);
      const permissions$ = store.selectSignal(authFeature.selectPermissions);
      const menu$ = store.selectSignal(navMenuFeature.selectAll);

      const allowed$ = computed(() => {
        const user = user$();
        if (!user)
          return new Set<string>();

        const permissions = untracked(permissions$);

        const allowedIds = new Set<string>();

        const menu = menu$();

        for (const item of menu.list) {

          // allow if
          // - item has no children, and
          // - the permissions are granted
          const allowed =
            !(item.id in menu.children) &&
            isAllowedMenuItem(item, permissions);

          // if allowed, add the item and all ancestors
          // to the allowed ids
          if (allowed) {
            allowedIds.add(item.id);
            let parent = item.parent;
            while (parent) {
              if (allowedIds.has(parent))
                break;
              allowedIds.add(parent);
              parent = menu.map[parent]?.id;
            }
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

function isAllowedMenuItem(item: AuthenticatedMenuItem, grants: string[]) {
  // no need to check if permissions not provided
  if (!('permissions' in item) || !item.permissions?.length)
    return true;

  // validate the permission strings in the menu item
  item.permissions.forEach(permission => {
    if (!isPermissionDefined(permission))
      throw new Error(`menu item '${item.id}' uses a permission '${permission}' which is not defined`);
  });

  // return the result
  return item.permissions.some(p => isPermissionGranted(p, grants));
}