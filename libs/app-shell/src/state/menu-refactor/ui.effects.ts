import { BreakpointObserver } from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { EventType, Router } from '@angular/router';
import { createEffect } from '@ngrx/effects';
import { distinctUntilChanged, filter, first, map, switchMap } from 'rxjs';
import { AuthService } from '../services/auth';
import { ScreenSize, uiActions } from './ui';

const Breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)'
} satisfies { [k in ScreenSize]?: string };

const searchable = Object.keys(Breakpoints) as (keyof typeof Breakpoints)[];

export const uiEffects = {
  observeBreakpoints: createEffect(
    () => {
      const bo = inject(BreakpointObserver);
      return bo.observe(searchable.map(s => Breakpoints[s]))
        .pipe(
          map(observed => {
            let result: ScreenSize = 'xs';
            for (const size of searchable) {
              if (observed.breakpoints[Breakpoints[size]] === true)
                result = size;
              else
                break;
            }
            return result;
          }),
          distinctUntilChanged(),
          map(size => uiActions.updateScreenSize({ size }))
        );
    },
    { functional: true }
  ),
  watchRouterNavigation: createEffect(
    () => {
      const router = inject(Router);
      const auth = inject(AuthService);

      return router.events.pipe(
        switchMap(event => auth.ready$.then(() => event)),
        map(event => {
          switch (event.type) {
            case EventType.NavigationStart: return true;
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
};
