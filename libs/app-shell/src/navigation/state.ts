import { Injectable, signal } from '@angular/core';

export interface MenuItem {
  name: string;
  link: string;
  fragment?: string;
  icon?: string;
  children?: MenuItem[];
}

export const NOOP_CLICK = 'javascript:void(0)';


@Injectable({
  providedIn: 'root'
})
export class NavMenuState {
  readonly horizontal$ = signal<MenuItem[]>([]);
  readonly vertical$ = signal<MenuItem[]>([]);
}