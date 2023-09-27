export interface HelpItem {
  slug: string;
  title: string;
  content: string[];
}

export interface HelpGroup {
  slug: string;
  title: string;
  items: HelpItem[];
  link: string;
}
