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
      const screens = inject(TW_THEME).screens as Record<string, string>;

      console.debug(screens);
      const breakpoints = new Map(
        screenSizes.map(size => [size, `(min-width: ${screens[size]})`])
      );

      const bo = inject(BreakpointObserver);
      return bo.observe([...breakpoints.values()])
        .pipe(
          map(observed => {
            let result: ScreenSize = 'xs';
            for (const size of screenSizes) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const bp = breakpoints.get(size)!;
              if (observed.breakpoints[bp] === true)
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