import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { produce } from 'immer';

export const screenSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl'
] as const;

export type ScreenSize = typeof screenSizes[number];

export interface UiState {
  screenSize: ScreenSize;
  isTouchDevice: boolean;
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
    'update screen size': props<{ size: ScreenSize; }>(),
    'update touch device': emptyProps(),
    'update navigation state': props<{ navigating: boolean; }>(),
    'update vertical offset': props<{ verticalOffset: number; }>(),
    'hide splash screen': emptyProps()
  }
});

export const sidebarActions = createActionGroup({
  source: 'ui-sidebar',
  events: {
    'toggle expansion': emptyProps(),
    'expand': emptyProps(),
    'contract': emptyProps(),
    'toggle visibility': emptyProps(),
    'show': emptyProps(),
    'hide': emptyProps(),
  }
});

export const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer<UiState>(
    {
      screenSize: 'xs',
      isTouchDevice: false,
      sidebar: {
        visible: false,
        expanded: false,
      },
      navigating: true,
      verticalOffset: 0,
      showSplashScreen: true
    },
    on(uiActions.updateNavigationState, produce((state, { navigating }) => {
      state.navigating = navigating;
    })),

    on(uiActions.updateScreenSize, produce((state, { size }) => {
      state.screenSize = size;
    })),

    on(uiActions.updateTouchDevice, produce((state) => {
      state.isTouchDevice = isTouchDevice();
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
  )
});

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0));
}
