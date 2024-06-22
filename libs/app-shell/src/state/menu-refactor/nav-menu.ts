import { Injectable, signal } from '@angular/core';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  id: string;
  text: string;
  link: string;  
  fragment?: string; 
  icon?: IconDefinition; // TODO: change this back to icon prop
  permission?: string;  
  parent?: string;  // reference to parent for a link not required for now
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
