import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';
import { AuthenticatedMenuItem } from '../navigation/models';
import { sortNumber } from '../utilities/sort';

export interface State {
  all: {
    list: AuthenticatedMenuItem[];
    map: Record<string, AuthenticatedMenuItem>;
    order: Record<string, number>;
    children: Record<string, string[]>;
  };
  allowed: {
    set: Set<string>;
    ordered: AuthenticatedMenuItem[];
  };
}

export const navMenuActions = createActionGroup({
  source: 'nav-menu',
  events: {
    'update all items': props<{ payload: { items: AuthenticatedMenuItem[]; }; }>(),
    'update allowed items': props<{ payload: { items: Set<string>; }; }>()
  }
});

export const navMenuFeature = createFeature({
  name: 'navMenu',
  reducer: createReducer<State>(
    {
      all: {
        list: [],
        map: {},
        order: {},
        children: {}
      },
      allowed: {
        set: new Set(),
        ordered: [],
      }
    },

    on(navMenuActions.updateAllItems, (state, { payload }) => {
      state = { ...state };

      const list = payload.items;
      const map: State['all']['map'] = {};
      const order: State['all']['order'] = {};
      const children: State['all']['children'] = {};

      list.forEach((item, index) => {
        if (item.id in map)
          throw new Error(`duplicate id for menu item: '${item.id}'`);
        map[item.id] = item;
        order[item.id] = index;
      });


      for (const item of list) {
        if (item.parent) {
          if (!(item.parent in map))
            throw new Error(`menu item '${item.id}' specifies a parent '${item.parent}' which does not exist`);
          children[item.parent] ||= [];
          children[item.parent].push(item.id);
        }
      }

      state.all = { list, map, order, children };
      return state;
    }),

    on(navMenuActions.updateAllowedItems, (state, { payload }) => {
      state = { ...state };

      const set = payload.items;
      const ordered = [...set]
        .sort(sortNavMenu.ids(state.all.order))
        .map(i => state.all.map[i]);

      state.allowed = { set, ordered };

      return state;
    })
  ),
});

type OrderMap = State['all']['order'];
export const sortNavMenu = {
  ids: (order: OrderMap) =>
    (a: string, b: string) =>
      sortNumber(order[a], order[b]),
  items: (order: OrderMap) =>
    (a: AuthenticatedMenuItem, b: AuthenticatedMenuItem) =>
      sortNumber(order[a.id], order[b.id])
} as const;
