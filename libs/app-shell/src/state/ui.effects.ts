import { BreakpointObserver } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { EMPTY, distinctUntilChanged, filter, first, fromEvent, map, startWith, switchMap } from 'rxjs';
import type { ScreensConfig } from 'tailwindcss/types/config';
import { TW_THEME } from '../common/tw-theme';
import { ScreenSize, screenSizes, uiActions } from './ui';
import { EventType, Router, Scroll } from '@angular/router';
import { AuthService } from '../services/auth';

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
          distinctUntilChanged(),
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
  ),
  watchRouterNavigation: createEffect(
    () => {
      const router = inject(Router);
      const auth = inject(AuthService);

      return router.events.pipe(
        // TODO: implement auth.ready$
        // switchMap(event => auth.ready$.then(() => event instanceof Scroll ? event.routerEvent : event)),
        // TODO: remove the following line after auth.ready$ is implemented
        map(event => event instanceof Scroll ? event.routerEvent : event),
        map(event => {
          switch (event.type) {
            case EventType.NavigationStart:
            case EventType.ResolveStart: return true;
            case EventType.NavigationEnd:
            case EventType.NavigationCancel:
            case EventType.NavigationError: return false;
            default: return undefined;
          }
        }),
        filter((nav): nav is boolean => typeof nav === 'boolean'),
        distinctUntilChanged(),
        map(navigating => uiActions.updateNavigationState({ navigating }))
      );
    },
    { functional: true }
  ),
  hideSplashScreen: createEffect(
    () => {
      const router = inject(Router);

      return router.events
        .pipe(
          filter(e => e.type === EventType.ActivationStart),
          first(),
          map(() => uiActions.hideSplashScreen())
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