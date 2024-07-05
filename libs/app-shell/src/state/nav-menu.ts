import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';
import { AuthenticatedMenuItem } from '../navigation/models';
import { sortNumber } from '../utilities/sort';

export interface State {
  list: AuthenticatedMenuItem[];
  map: Record<string, AuthenticatedMenuItem>;
  order: Record<string, number>;
}

export const navMenuActions = createActionGroup({
  source: 'nav-menu',
  events: {
    'update all items': props<{ payload: { items: AuthenticatedMenuItem[]; }; }>()
  }
});

export const navMenuFeature = createFeature({
  name: 'navMenu',
  reducer: createReducer<State>(
    {
      list: [],
      map: {},
      order: {}
    },

    on(navMenuActions.updateAllItems, (state, { payload }) => {

      const list = payload.items;
      const map: State['map'] = {};
      const order: State['order'] = {};

      list.forEach((item, index) => {
        map[item.id] = item;
        order[item.id] = index;
      });


      for (const item of list) {
        if (item.parent) {
          if (!(item.parent in map))
            throw new Error(`menu item '${item.id}' specifies a parent '${item.parent}' which does not exist`);
        }
      }

      state = { list, map, order };
      return state;
    })
  ),
});

type OrderMap = State['order'];
export const sortNavMenu = {
  ids: (order: OrderMap) =>
    (a: string, b: string) =>
      sortNumber(order[a], order[b]),
  items: (order: OrderMap) =>
    (a: AuthenticatedMenuItem, b: AuthenticatedMenuItem) =>
      sortNumber(order[a.id], order[b.id])
} as const;
