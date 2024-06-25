import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  id: string;
  text: string;
  link: string;
  fragment?: string;
  icon?: IconDefinition;
  permission?: string;
  parent?: string;
  children?: MenuItem[];
}

export const NOOP_CLICK = 'javascript:void(0)' as const;
