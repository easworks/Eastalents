import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AuthUser } from '../state/auth';

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
  auth?: (user: AuthUser) => boolean;
}

export const NOOP_CLICK = 'javascript:void(0)' as const;
