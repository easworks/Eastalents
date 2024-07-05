import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  text: string;
  link: string;
  fragment?: string;
  icon?: IconDefinition;
  children?: MenuItem[];
}

export const NOOP_CLICK = 'javascript:void(0)' as const;
