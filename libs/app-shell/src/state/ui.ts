import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { produce } from 'immer';

// mimic the breakpoints we configured in tailwind
export const screenSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl'
] as const;
export type ScreenSize = typeof screenSizes[number];

export interface State {
  screenSize: ScreenSize;
  isTouchDevice: boolean;
  topBar: {
    dark: boolean;
  };
  sidebar: {
    visible: boolean;
    expanded: boolean;
  };
  navigating: boolean;
  verticalOffset: number;
  showSplashScreen: boolean;
}

export const uiActions = createActionGroup({
  source: 'ui',
  events: {
    'update screen size': props<{ payload: { size: ScreenSize; }; }>(),
    'update touch device': emptyProps(),
    'update top bar mode': props<{ payload: { dark: boolean; }; }>(),
    'update navigation state': props<{ navigating: boolean; }>(),
    'update vertical offset': props<{ verticalOffset: number; }>(),
    'hide splash screen': emptyProps()
  }
});

export const sidebarActions = createActionGroup({
  source: 'ui-sidebar',
  events: {
    'toggle visibility': emptyProps(),
    'toggle expansion': emptyProps(),
    'show': emptyProps(),
    'hide': emptyProps(),
    'expand': emptyProps(),
    'contract': emptyProps()
  }
});

export const UI_FEATURE = createFeature({
  name: 'ui',
  reducer: createReducer<State>(
    {
      screenSize: 'sm',
      isTouchDevice: false,
      topBar: {
        dark: true
      },
      sidebar: {
        visible: false,
        expanded: false,
      },
      navigating: true,
      verticalOffset: 0,
      showSplashScreen: false
    },
    on(uiActions.updateNavigationState, produce((state, { navigating }) => {
      state.navigating = navigating;
    })),
    on(uiActions.updateScreenSize, produce((state, { payload }) => {
      state.screenSize = payload.size;
      return state;
    })),
    on(uiActions.updateTouchDevice, produce((state) => {
      state.isTouchDevice = isTouchDevice();
      return state;
    })),
    on(uiActions.updateTopBarMode, produce((state, { payload }) => {
      state.topBar.dark = payload.dark;
      return state;
    })),

    on(sidebarActions.expand, produce(state => {
      state.sidebar.expanded = true;
    })),
    on(sidebarActions.contract, produce(state => {
      state.sidebar.expanded = false;
    })),
    on(sidebarActions.toggleExpansion, produce(state => {
      state.sidebar.expanded = !state.sidebar.expanded;
    })),
    on(sidebarActions.show, produce(state => {
      state.sidebar.visible = true;
    })),
    on(sidebarActions.hide, produce(state => {
      state.sidebar.visible = false;
    })),
    on(sidebarActions.toggleVisibility, produce(state => {
      state.sidebar.visible = !state.sidebar.visible;
    })),

    on(uiActions.updateVerticalOffset, produce((state, { verticalOffset }) => {
      state.verticalOffset = verticalOffset;
    })),
    on(uiActions.hideSplashScreen, produce((state) => {
      state.showSplashScreen = false;
    }))
  ),
});

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0));
}