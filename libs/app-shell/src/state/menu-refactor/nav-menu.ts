import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';

export const navMenuActions = createActionGroup({
  source: 'navMenu',
  events: {
    'update vertical items': props<{ items: MenuItem[]; }>()
  }
});

export interface MenuItem {
  id: string;
  text: string;
  link: string;
  fragment?: string;
  icon?: IconProp;
  permission?: string;
  parent?: string;
}

export interface NavMenuState {
  horizontal: MenuItem[];
  vertical: MenuItem[];
}

export const navMenuFeature = createFeature({
  name: 'navMenu',
  reducer: createReducer<NavMenuState>(
    {
      horizontal: [],
      vertical: []
    },

    on(navMenuActions.updateVerticalItems, (state, { items }) => {
      state = { ...state };
      state.vertical = items;
      return state;
    })
  )
});
