import { BreakpointObserver } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { EMPTY, distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';
import type { ScreensConfig } from 'tailwindcss/types/config';
import { TW_THEME } from '../common/tw-theme';
import { ScreenSize, screenSizes, uiActions } from './ui';

export const uiEffects = {
  validateScreenDeclarations: createEffect(
    () => {

      const screens = inject(TW_THEME).screens as ScreensConfig;
      const themeSizes = Object.keys(screens);

      validateScreenDeclarations(themeSizes, screenSizes);

      return EMPTY;
    },
    { functional: true, dispatch: false }),
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
          startWith(scrollingElement.scrollTop),
          map(top => top === 0),
          distinctUntilChanged(),
          map(dark => uiActions.updateTopBarMode({ payload: { dark } }))
        );
    },
    { functional: true }
  )
} as const;

function validateScreenDeclarations(
  tailwind: readonly string[],
  screens: readonly string[]
) {

  const sets = {
    screens: new Set(screens),
    tailwind: new Set(tailwind),
  };

  for (const size of tailwind) {
    if (!sets.screens.has(size)) {
      throw new Error(`'${size}' is declared in tailwind config, but not declared in typescript screens`);
    }
  }

  for (const size of screens) {
    if (!sets.tailwind.has(size)) {
      throw new Error(`'${size}' is declared in typescript screen, but not declared in tailwind config`);
    }
  }
}