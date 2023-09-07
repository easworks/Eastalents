import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { createAction, props } from '@ngrx/store';
import { distinctUntilChanged, filter, fromEvent, map, shareReplay } from 'rxjs';
import { ACTIONS, createFeature, on } from './redux-signals';

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

const actions = {
  screenSize: {
    update: createAction('[UI] [SCREEN SIZE] [UPDATE]', props<{ payload: { size: ScreenSize; }; }>())
  },
  touchDevice: {
    update: createAction('[UI] [COMPACT] [UPDATE]')
  },
  topBar: {
    updateMode: createAction('[UI] [TOP BAR] [UPDATE MODE]', props<{ payload: { dark: boolean; }; }>())
  }
} as const;

const initialState: State = {
  screenSize: 'sm',
  isTouchDevice: false,
  topBar: {
    dark: true
  }
};

export const UI_FEATURE = createFeature({
  initialState,
  actions,
  reducers: [
    on(actions.screenSize.update, (state, { payload }) => {
      state.screenSize = payload.size;
      return state;
    }),
    on(actions.touchDevice.update, (state) => {
      state.isTouchDevice = isTouchDevice();
      return state;
    }),
    on(actions.topBar.updateMode, (state, { payload }) => {
      state.topBar.dark = payload.dark;
      return state;
    })
  ],
  selectors: (state$) => ({
    screenSize$: computed(() => state$().screenSize),
    isTouchDevice$: computed(() => state$().isTouchDevice),
    topBar$: computed(() => state$().topBar),
  }),
  initEffects: () => {
    const actions$ = inject(ACTIONS);
    const bo = inject(BreakpointObserver);

    const Breakpoints = {
      md: '(min-width: 37.5rem)',
      lg: '(min-width: 60rem)',
      xl: '(min-width: 80rem)'
    } satisfies { [k in ScreenSize]?: string };
    const searchable = Object.keys(Breakpoints) as (keyof typeof Breakpoints)[];

    bo.observe(searchable.map(s => Breakpoints[s]))
      .pipe(
        map(observed => {
          let result: ScreenSize = 'sm';
          for (const size of searchable) {
            if (observed.breakpoints[Breakpoints[size]] === true)
              result = size;
            else
              break;
          }
          return result;
        }),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(size =>
        actions$.dispatch(
          actions.screenSize.update({ payload: { size } })));

    const scrollingElement = document.scrollingElement;
    if (!scrollingElement)
      throw new Error('invalid operation');

    fromEvent(document, 'scroll')
      .pipe(
        map(() => scrollingElement.scrollTop),
        filter(top => top <= 160),
        map(top => top === 0),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(dark =>
        actions$.dispatch(
          actions.topBar.updateMode({ payload: { dark } })));
  }
});


function observeBreakpoint(bo: BreakpointObserver, query: string) {
  return bo.observe(query)
    .pipe(
      map(bps => {
        return bps.breakpoints[query];
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0));
}