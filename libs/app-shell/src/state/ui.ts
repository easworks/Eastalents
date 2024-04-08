import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { produce } from 'immer';

// mimic the breakpoints we configured in tailwind
export const screenSizes = [
  'sm',
  'md',
  'lg',
  'xl'
] as const;
export type ScreenSize = typeof screenSizes[number];

export interface State {
  screenSize: ScreenSize;
  isTouchDevice: boolean;
  topBar: {
    dark: boolean;
  };
}

export const uiActions = createActionGroup({
  source: 'ui',
  events: {
    'update screen size': props<{ payload: { size: ScreenSize; }; }>(),
    'update touch device': emptyProps(),
    'update top bar mode': props<{ payload: { dark: boolean; }; }>()
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
      }
    },
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
    }))
  ),
});

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0));
}