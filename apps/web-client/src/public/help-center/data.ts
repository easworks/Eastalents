export interface HelpItem {
  slug: string;
  title: string;
  content: string[];
}

export interface HelpGroup {
  slug: string;
  title: string;
  items: HelpItem[];
}

export const employerHelpGroups: HelpGroup[] = [
  {
    slug: 'describe-your-needs',
    title: 'Describe your needs',
    items: [
      {
        slug: 'what-is-easworks',
        title: 'What is Easworks?',
        content: []
      },
      {

      }
    ]
  }
];