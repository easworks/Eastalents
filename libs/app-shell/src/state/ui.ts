import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';

// mimic the breakpoints we configured in tailwind
export const screenSizes = [
  'sm',
  'md',
  'lg',
  'xl'
] as const;
export type ScreenSize = typeof screenSizes[number];

const Breakpoints = {
  md: '(min-width: 37.5rem)',
  lg: '(min-width: 60rem)',
  xl: '(min-width: 80rem)'
} satisfies { [k in ScreenSize]?: string }



@Injectable({
  providedIn: 'root'
})
export class UiState {

  private readonly bo = inject(BreakpointObserver);

  readonly isTouchDevice$ = signal(isTouchDevice());

  private readonly searchable = [
    'md', 'lg', 'xl'
  ] as const satisfies readonly ScreenSize[];

  readonly screenSize$ = toSignal(this.bo.observe(this.searchable.map(s => Breakpoints[s]))
    .pipe(map(bps => {
      let result: ScreenSize = 'sm';

      for (const size of this.searchable) {
        if (bps.breakpoints[Breakpoints[size]] === true)
          result = size
        else
          break
      }

      return result;
    })), { requireSync: true });

  observe(query: string) {
    return this.bo.observe(query)
      .pipe(
        map(bps => {
          return bps.breakpoints[query]
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      )
  }

  updateTouchDetection() {
    this.isTouchDevice$.set(isTouchDevice());
  }
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0));
}