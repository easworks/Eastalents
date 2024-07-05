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

interface MenuItemWithId extends MenuItemBase {
  id: string;
  parent?: string;
}

interface LeafMenuItem extends MenuItemWithId {
  permissions?: string[];
}

interface BranchMenuItem extends MenuItemWithId {
  children: AuthenticatedMenuItem[];
}

export type AuthenticatedMenuItem = LeafMenuItem | BranchMenuItem;

export const NOOP_CLICK = 'javascript:void(0)' as const;
