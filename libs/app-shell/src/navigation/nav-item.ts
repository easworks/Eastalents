export interface NavItem {
  name: string;
  link: string;
  fragment?: string;
  icon?: string;
  children?: NavItem[];
}

export const NOOP_CLICK = 'javascript:void(0)';