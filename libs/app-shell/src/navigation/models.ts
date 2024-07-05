import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface MenuItemBase {
  text: string;
  link: string;
  fragment?: string;
  icon?: IconDefinition;
}

export interface MenuItem extends MenuItemBase {
  children?: MenuItem[];
}

export interface AuthenticatedMenuItem extends MenuItemBase {
  id: string;
  parent?: string;
  permissions?: string[];
}

export const NOOP_CLICK = 'javascript:void(0)' as const;
