export interface HelpItem {
  slug: string;
  title: string;
  content: string[];
  link: string;
}

export interface HelpGroup {
  slug: string;
  title: string;
  items: HelpItem[];
  link: string;
}
