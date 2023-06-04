import { Injectable, isDevMode, signal } from '@angular/core';

export interface MenuItem {
  name: string;
  link: string;
  fragment?: string;
  icon?: string;
  children?: MenuItem[];
}

export const NOOP_CLICK = isDevMode() ? '/broken-link' : 'javascript:void(0)' as const;

export type MenuMode = 'horizontal' | 'vertical';

@Injectable({
  providedIn: 'root'
})
export class NavMenuState {
  readonly publicMenu = {
    horizontal$: signal<MenuItem[]>([]),
    vertical$: signal<MenuItem[]>([])
  } as const;
}
