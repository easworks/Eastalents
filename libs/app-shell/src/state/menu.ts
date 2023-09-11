import { Injectable, signal } from '@angular/core';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  name: string;
  link: string;
  fragment?: string;
  icon?: IconDefinition;
  children?: MenuItem[];
}

export const NOOP_CLICK = 'javascript:void(0)' as const;

export type MenuMode = 'horizontal' | 'vertical';

@Injectable({
  providedIn: 'root'
})
export class NavMenuState {
  readonly publicMenu = {
    horizontal$: signal<MenuItem[]>([]),
    vertical$: signal<MenuItem[]>([])
  } as const;

  readonly brandLinks$ = signal<MenuItem[]>([]);
}
