import { BreakpointObserver } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { ScreenSize, uiActions } from './ui';



export const uiEffects = {
  updateBreakpoints: createEffect(
    () => {
      const breakpoints = {
        md: '(min-width: 36rem)',
        lg: '(min-width: 60rem)',
        xl: '(min-width: 72rem)'
      } satisfies { [k in ScreenSize]?: string };
      const searchable = Object.keys(breakpoints) as (keyof typeof breakpoints)[];

      const bo = inject(BreakpointObserver);
      return bo.observe(searchable.map(s => breakpoints[s]))
        .pipe(
          map(observed => {
            let result: ScreenSize = 'sm';
            for (const size of searchable) {
              if (observed.breakpoints[breakpoints[size]] === true)
                result = size;
              else
                break;
            }
            return result;
          }),
          map(size => uiActions.updateScreenSize({ payload: { size } }))
        );
    },
    { functional: true }),
  updateTopBarDarkMode: createEffect(
    () => {
      const scrollingElement = document.scrollingElement;
      if (!scrollingElement)
        throw new Error('invalid operation');

      return fromEvent(document, 'scroll')
        .pipe(
          map(() => scrollingElement.scrollTop),
          filter(top => top <= 160),
          map(top => top === 0),
          distinctUntilChanged(),
          map(dark => uiActions.updateTopBarMode({ payload: { dark } }))
        );
    },
    { functional: true }
  )
} as const;